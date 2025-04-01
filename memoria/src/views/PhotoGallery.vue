<template>
  <div class="gallery-container overflow-auto">
    <h1>Fotogalerie</h1>

    <input v-model="searchQuery" placeholder="Suchen..." class="search-input"/>

    <div class="image-grid">
      <div
        v-for="image in filteredImages"
        :key="image.id"
        class="image-card"
        @click="openModal(image)"
      >
        <img :src="image.imageUrl" class="gallery-img" alt="Bild" />
        <div class="image-title">{{ image.title }}</div>
      </div>
    </div>

    <!-- Modal für Bildinformationen -->
    <div
      class="modal fade"
      id="imageModal"
      tabindex="-1"
      aria-labelledby="imageModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="imageModalLabel">
              {{ selectedImage.title || "Bildinfo" }}
            </h5>
            <button
              type="button"
              class="btn-close align-end"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body text-start">
            <img
              :src="selectedImage.imageUrl"
              class="modal-img mb-2"
              alt="Bildvorschau"
            />
            <p>
              <strong>Datum:</strong> {{ selectedImage.date || "Kein Datum" }}
            </p>
            <p>
              <strong>Ort:</strong> {{ selectedImage.location || "Kein Ort" }}
            </p>
            <p>
              <strong>Tags:</strong>
              {{
                selectedImage.tags
                  ? selectedImage.tags.join(", ")
                  : "Keine Tags"
              }}
            </p>
            <p>
              <strong>Beschreibung:</strong>
              {{ selectedImage.description || "Keine Beschreibung" }}
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="deleteImage">
              <i class="bi bi-trash"></i> Löschen
            </button>
            <button class="btn" @click="editImageInfo">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { db, storage } from "@/firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

const router = useRouter();
const images = ref([]);
const selectedImage = ref({});
const searchQuery = ref("");

// 🔹 Daten aus Firestore laden
onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "images-infos"));
  images.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
});

const filteredImages = computed(() => {
  if (!searchQuery.value) return images.value;
  return images.value.filter(image => 
    image.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    image.location?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (image.tags && image.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase())))
  );
});

const openModal = (image) => {
  selectedImage.value = image;
  new bootstrap.Modal(document.getElementById("imageModal")).show();
};

// 🔹 Weiterleitung zur ImageInfo.vue mit bereits vorhandenen Infos
const editImageInfo = () => {
  const modalInstance = bootstrap.Modal.getInstance(
    document.getElementById("imageModal")
  );
  if (modalInstance) {
    modalInstance.hide();
  }
  router.push({
    name: "ImageInfo",
    query: {
      imageUrl: encodeURIComponent(selectedImage.value.imageUrl),
      imageId: selectedImage.value.id,
      title: selectedImage.value.title || "",
      date: selectedImage.value.date || "",
      location: selectedImage.value.location || "",
      tags: selectedImage.value.tags ? selectedImage.value.tags.join(", ") : "",
      description: selectedImage.value.description || "",
    },
  });
};

const deleteImage = async () => {
  if (confirm("Möchtest du dieses Bild wirklich löschen?")) {
    try {
      await deleteDoc(doc(db, "images-infos", selectedImage.value.id));

      const imageRef = storageRef(storage, selectedImage.value.imageUrl);
      await deleteObject(imageRef);

      alert("Bild erfolgreich gelöscht!");
      images.value = images.value.filter(
        (img) => img.id !== selectedImage.value.id
      );

      bootstrap.Modal.getInstance(document.getElementById("imageModal")).hide();
    } catch (error) {
      console.error("Fehler beim Löschen: ", error);
      alert("Fehler beim Löschen des Bildes.");
    }
  }
};
</script>

<style scoped>
.gallery-container {
  text-align: center;
  padding: 20px;
  overflow-y: scroll;
  padding-bottom: 120px;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
}

/* Grid für 2 Bilder pro Zeile */
.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  justify-content: center;
}

/* Polaroid-Stil für die Karten */
.image-card {
  position: relative;
  background: white;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
  overflow: visible;
  padding: 5px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.image-card:hover {
  transform: scale(1.05);
}

/* Bild im Polaroid */
.gallery-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

/* Titel unter dem Bild */
.image-title {
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  margin-top: 8px;
  color: #333;
}

/* Modal-Styling */
.modal-img {
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
