<template>
  <div class="upload-page">
    <div class="upload-container">
      <div class="scrollable-content">
        <h1 class="text-center">Bild hochladen</h1>

        <label for="file-upload" class="btn btn-secondary w-100"
          >Foto auswählen</label
        >
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          @change="previewImage"
        />

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

        <img
          v-if="imagePreview"
          :src="imagePreview"
          class="upload-preview"
          alt="Vorschau"
          @error="onImageError"
        />

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
import { getAuth } from "firebase/auth";

const router = useRouter();
const imageFile = ref(null);
const imagePreview = ref("");
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

const onImageError = () => {
  imagePreview.value = "";
};

const uploadImage = async () => {
  if (!imageFile.value) {
    uploadError.value = "Bitte wähle ein Bild aus.";
    return;
  }

  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    uploadError.value = "Nicht authentifiziert.";
    return;
  }

  isUploading.value = true;

  const fileName = `${Date.now()}_${imageFile.value.name}`;
  const filePath = `images/${currentUser.uid}/${fileName}`;
  const fileRef = storageRef(storage, filePath);

  const uploadTask = uploadBytesResumable(fileRef, imageFile.value);

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
      try {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        const docRef = await addDoc(collection(db, "images-infos"), {
          imageUrl: downloadURL,
          createdAt: serverTimestamp(),
          userId: currentUser.uid,
        });

        router.push({
          name: "ImageInfo",
          query: {
            imageUrl: encodeURIComponent(downloadURL),
            imageId: docRef.id,
          },
        });
      } catch (err) {
        uploadError.value = `Fehler beim Speichern: ${err.message}`;
      } finally {
        isUploading.value = false;
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
  margin-top: 10px;
}
</style>
