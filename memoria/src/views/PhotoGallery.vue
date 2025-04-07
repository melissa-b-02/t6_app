<template>
  <div class="gallery-container overflow-auto">
    <h1>Fotogalerie</h1>
    <div class="d-flex align-items-center gap-2 mb-3">
      <input
        v-model="searchQuery"
        placeholder="Suche..."
        class="form-control flex-grow-1"/>
      <button class="btn" @click="toggleDateFilter">
        <i class="bi bi-calendar"></i>
      </button>
    </div>

    <transition name="fade">
      <div
        v-show="dateFilterVisible"
        class="filter-bar p-3 mb-4 border rounded shadow-sm bg-light"
      >
        <div class="d-flex gap-2">
          <input id="startDate" class="form-control" placeholder="von" />
          <input id="endDate" class="form-control" placeholder="bis" />
        </div>
        <button class="btn mt-3" @click="clearFilters">
          <i class="bi bi-arrow-counterclockwise"></i> Filter zurücksetzen
        </button>
      </div>
    </transition>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-secondary" role="status"></div>
    </div>

    <template v-else-if="filteredImagesFiltered?.length">
      <div class="image-grid">
        <div
          v-for="image in filteredImagesFiltered"
          :key="image.id"
          class="image-card"
          @click="openModal(image)">
          <img
            :src="image.imageUrl"
            class="gallery-img"
            alt="Bild"
            @error="onImageError"
          />
          <div class="image-title">{{ image.title }}</div>
        </div>
      </div>
    </template>

    <div v-else class="text-center mt-4">
      <div class="text-muted">
        <i class="bi bi-exclamation-circle"></i> Keine Ergebnisse gefunden.
      </div>
      <button class="btn mt-2" @click="clearFilters">
        <i class="bi bi-arrow-counterclockwise"></i> Filter zurücksetzen
      </button>
    </div>

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
              @error="onImageError"
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
            <button class="btn-opposite" @click="deleteImage">
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
import $ from "jquery";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "bootstrap-datepicker";

window.$ = window.jQuery = $;

const router = useRouter();
const images = ref([]);
const selectedImage = ref({});
const searchQuery = ref("");
const startDate = ref("");
const endDate = ref("");
const dateFilterVisible = ref(false);
const loading = ref(true);

const toggleDateFilter = () => {
  dateFilterVisible.value = !dateFilterVisible.value;
};

const clearFilters = () => {
  searchQuery.value = "";
  startDate.value = "";
  endDate.value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
};

const onImageError = (e) => {
  e.target.src = "/img/placeholder.png";
};

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "images-infos"));
  images.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  loading.value = false;

  $("#startDate")
    .datepicker({
      format: "yyyy-mm-dd",
      autoclose: true,
      todayHighlight: true,
    })
    .on("changeDate", (e) => {
      startDate.value = e.target.value;
    });

  $("#endDate")
    .datepicker({
      format: "yyyy-mm-dd",
      autoclose: true,
      todayHighlight: true,
    })
    .on("changeDate", (e) => {
      endDate.value = e.target.value;
    });
});

const filteredImages = computed(() => images.value?.filter(Boolean) || []);

const filteredImagesFiltered = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return filteredImages.value.filter(Boolean).filter((image) => {
    const matchText =
      image.title?.toLowerCase().includes(query) ||
      image.location?.toLowerCase().includes(query) ||
      image.tags?.some((tag) => tag.toLowerCase().includes(query));
    const imgDate = image.date;
    const matchDate =
      (!startDate.value || imgDate >= startDate.value) &&
      (!endDate.value || imgDate <= endDate.value);
    return matchText && matchDate;
  });
});

const openModal = (image) => {
  selectedImage.value = image;
  new bootstrap.Modal(document.getElementById("imageModal")).show();
};

const editImageInfo = () => {
  const modalInstance = bootstrap.Modal.getInstance(
    document.getElementById("imageModal")
  );
  if (modalInstance) modalInstance.hide();

  if (selectedImage.value?.imageUrl && selectedImage.value?.id) {
    router.push({
      name: "ImageInfo",
      query: {
        imageUrl: encodeURIComponent(selectedImage.value.imageUrl),
        imageId: selectedImage.value.id,
        title: selectedImage.value.title || "",
        date: selectedImage.value.date || "",
        location: selectedImage.value.location || "",
        tags: selectedImage.value.tags
          ? selectedImage.value.tags.join(", ")
          : "",
        description: selectedImage.value.description || "",
      },
    });
  } else {
    alert("Fehler: Bilddaten unvollständig.");
  }
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

.form-control {
  padding: 10px 20px;
  margin: 0 auto;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.search-input::placeholder {
  color: #999;
  opacity: 0.7;
  font-size: 14px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  justify-content: center;
}

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

.gallery-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.image-title {
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  margin-top: 8px;
  color: #333;
}

.modal-img {
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }
  img.gallery-img {
    max-width: 100% !important;
    height: auto;
    object-fit: cover;
    aspect-ratio: 1/1;
  }
}
</style>
