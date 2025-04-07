<template>
  <div class="upload-page">
    <div class="upload-container">
      <div class="scrollable-content">
        <h1 class="text-center">Bild hochladen</h1>
        <!-- Datei auswählen -->
        <label for="file-upload" class="btn btn-secondary w-100"
          >Foto auswählen</label
        >
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          @change="previewImage"
        />

        <!-- Kamera öffnen -->
        <label for="camera-upload" class="btn btn-secondary w-100"
          >Kamera</label
        >
        <input
          id="camera-upload"
          type="file"
          accept="image/*"
          capture="environment"
          @change="previewImage"
        />

        <!-- Bild Vorschau -->
        <img
          v-if="imagePreview"
          :src="imagePreview"
          alt="Vorschau"
          class="upload-preview"
        />

        <!-- Weiter zur Bearbeitung -->
        <button
          @click="uploadImage"
          class="btn btn w-100 mt-3"
          :disabled="isUploading"
        >
          Weiter
        </button>

        <p v-if="uploadProgress">Upload: {{ uploadProgress }}%</p>
        <p v-if="uploadError" class="text-danger">{{ uploadError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storage, db } from "@/firebaseConfig";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const router = useRouter();
const imageFile = ref(null);
const imagePreview = ref(null);
const uploadProgress = ref(0);
const uploadError = ref("");
const isUploading = ref(false);

const previewImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const uploadImage = async () => {
  if (!imageFile.value) {
    uploadError.value = "Bitte wähle ein Bild aus.";
    return;
  }

  isUploading.value = true;
  const fileName = `${Date.now()}_${imageFile.value.name}`;
  const storageReference = storageRef(storage, `images/${fileName}`);
  const uploadTask = uploadBytesResumable(storageReference, imageFile.value);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      uploadProgress.value = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
    },
    (error) => {
      uploadError.value = `Upload fehlgeschlagen: ${error.message}`;
      isUploading.value = false;
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      isUploading.value = false;

      try {
        // Bild-Infos in Firestore speichern
        const imageRef = await addDoc(collection(db, "images-collection"), {
          imageUrl: downloadURL,
          createdAt: serverTimestamp(),
        });

        router.push({
          name: "ImageInfo",
          query: {
            imageUrl: encodeURIComponent(downloadURL),
            imageId: imageRef.id,
          },
        });
      } catch (err) {
        uploadError.value = `Fehler beim Speichern: ${err.message}`;
      }
    }
  );
};
</script>

<style scoped>
.upload-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.upload-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  padding-bottom: 80px;
}

.scrollable-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input[type="file"] {
  display: none;
}

.upload-preview {
  width: 100%;
  max-width: 350px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn {
  width: 100%;
}
</style>
