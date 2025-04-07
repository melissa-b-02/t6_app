<template>
  <div class="info-container">
    <div class="scroll-container">
      <h1 class="text-center">Bild bearbeiten</h1>

      <img :src="imageUrl" alt="Bildvorschau" class="image-preview mb-4" />

      <div class="mb-3">
        <label class="form-label">Titel</label>
        <input v-model="title" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Datum</label>
        <input
          ref="datepicker"
          type="text"
          class="form-control"
          placeholder="tt.mm.jjjj"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Ort</label>
        <input v-model="location" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Tags</label>
        <input
          v-model="tags"
          type="text"
          class="form-control"
          placeholder="Mit Komma trennen"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Beschreibung</label>
        <textarea v-model="description" class="form-control"></textarea>
      </div>

      <button @click="saveImageInfo" class="btn btn-primary w-100">
        Speichern
      </button>
    </div>

    <div class="blur-overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import $ from "jquery";
import "bootstrap-datepicker";

const route = useRoute();
const router = useRouter();

// Felder für Bild-Infos
const imageUrl = ref(decodeURIComponent(route.query.imageUrl));
const title = ref("");
const date = ref("");
const location = ref("");
const tags = ref("");
const description = ref("");
const datepicker = ref(null);

// Bereits gespeicherte Infos abrufen und Felder vorfüllen
onMounted(async () => {
  const imageDocId = route.query.imageId;
  if (imageDocId) {
    const docRef = doc(db, "images-infos", imageDocId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const imageData = docSnap.data();
      title.value = imageData.title || "";
      date.value = imageData.date || "";
      location.value = imageData.location || "";
      tags.value = imageData.tags ? imageData.tags.join(", ") : "";
      description.value = imageData.description || "";
    }
  }

  // Bootstrap Datepicker
  $(datepicker.value)
    .datepicker({
      format: "dd.mm.yyyy",
      autoclose: true,
      todayHighlight: true,
      language: "de",
    })
    .on("changeDate", (e) => {
      date.value = e.format();
    });

  if (date.value) {
    $(datepicker.value).datepicker("setDate", date.value);
  }
});

// Speichern der neuen Infos
const saveImageInfo = async () => {
  try {
    const imageDocId = route.query.imageId;
    const imageInfoRef = doc(db, "images-infos", imageDocId);

    await setDoc(imageInfoRef, {
      title: title.value,
      date: date.value,
      location: location.value,
      tags: tags.value.split(",").map((tag) => tag.trim()),
      description: description.value,
      imageUrl: imageUrl.value,
    });

    alert("Bildinfo gespeichert!");
    router.push("/gallery");
  } catch (error) {
    console.error("Fehler beim Speichern: ", error);
  }
};
</script>

<style scoped>
.info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: auto;
  padding-bottom: 60px;
}

.scroll-container {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  width: 100%;
  padding: 20px;
}

.blur-overlay {
  position: fixed;
  bottom: 60px;
  left: 0;
  width: 100%;
  height: 40px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    var(--main-bg-color)
  );
  pointer-events: none;
  z-index: 100;
}

.image-preview {
  width: 100%;
  border-radius: 10px;
}

.form-control {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.btn {
  background-color: #b20b13;
  color: white;
  padding: 12px;
  border: none;
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
}

.btn:hover {
  background-color: #8f0a0f;
}

@media (min-width: 768px) {
  .info-container {
    max-width: 700px;
    margin: 0 auto;
  }

  .scroll-container {
    padding: 2rem;
  }

  .image-preview {
    max-width: 300px;
    display: block;
    margin: 0 auto 2rem;
  }

  .form-control {
    font-size: 1.1rem;
    padding: 12px;
  }

  .btn {
    font-size: 1.1rem;
    padding: 12px 24px;
  }
}
</style>
