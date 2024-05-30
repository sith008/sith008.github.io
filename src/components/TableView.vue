<script setup>
// import modal
import Modal from "./Modal.vue";

import { watch, onBeforeMount, onMounted, ref, computed } from "vue";

// paginate
const currentPage = ref(1);
const itemsPerPage = ref(25);
const totalItems = ref(0);
const items = ref([]);

// sorting
const isAscSort = ref(true);

// fuzzy search on name property
const searchQuery = ref("");

// view
const isShowViewModal = ref(false);
const selectedItem = ref(null);

function showModal(item) {
  selectedItem.value = item;
  isShowViewModal.value = true;
  console.log("showModal");
  console.log(selectedItem.value);
  console.log(isShowViewModal.value);
  // update
}

// computed property to filter items based on search query
const filteredItems = computed(() => {
  return items.value.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// create a computeed property to calculate the current page items
const currentPageItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredItems.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value);
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    console.log(currentPage.value);
    currentPage.value++;
    console.log(currentPage.value);
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

// update the current page when the currentPage value changes
watch(currentPage, (newPage, oldPage) => {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("page", newPage);

  // update url without reloading the page
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState({}, "", newUrl);
});

watch(isAscSort, (newSort, oldSort) => {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("sort", newSort ? "asc" : "desc");
  // update url without reloading the page
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState({}, "", newUrl);
});

// sort countries by name.official asc by default
function sortCountriesByNameAsc() {
  items.value.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
}

function toggleSort() {
  if (isAscSort.value) {
    items.value.sort((a, b) => {
      if (a.name < b.name) {
        return 1;
      }
      if (a.name > b.name) {
        return -1;
      }
      return 0;
    });
  } else {
    items.value.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }
  isAscSort.value = !isAscSort.value;
}

// map json data to the required format
function mapJsonToData(json) {
  return json.map((item) => {
    // following the requirement
    // - Flags (Please use png file within flags property)
    // - Country Name (name.official)
    // - 2 character Country Code (cca2)
    // - 3 character Country Code (cca3)
    // - Native Country Name (name.nativeName)
    // - Alternative Country Name (altSpellings)
    // - Country Calling Codes (idd)
    return {
      flags: item.flags.png,
      name: item.name.official,
      cca2: item.cca2,
      cca3: item.cca3,
      nativeName: item.name.nativeName,
      altSpellings: item.altSpellings,
      idd: item.idd,
    };
  });
}

// handle object chaining
function getNativeName(item) {
  try {
    return item.nativeName[Object.keys(item.nativeName)]?.official || "";
  } catch (error) {
    console.log("Error in nativeName");
    console.log(item);
    return "";
  }
}

function getAltSpelling(item) {
  return item.altSpellings.join(", ");
}

function getIdd(item) {
  try {
    return item.idd.root + item.idd.suffixes[0];
  } catch (error) {
    return "";
  }
}

// Lifecycle hooks

onBeforeMount(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("page");
  const sort = urlParams.get("sort");
  currentPage.value = page ? parseInt(page) : 1;
  isAscSort.value = sort ? sort === "desc" : true;
});

onMounted(async () => {
  try {
    const response = await fetch("/countries.json");
    const data = await response.json();

    // setup pagination
    totalItems.value = data.length;
    items.value = mapJsonToData(data);

    // sortCountriesByNameAsc();
    toggleSort();

    console.log("Finished fetching data");
    console.log(totalItems.value);
    console.log(items.value[0]);
  } catch (error) {
    console.error(error);
  }
});

function closeModal() {
  isShowViewModal.value = false;
  console.log("closeModal");
}
</script>

<template>
  <Modal
    v-if="isShowViewModal"
    :item="selectedItem"
    @close-modal="closeModal"
  />
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div
      class="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900"
    >
      <label for="table-search" class="sr-only">Search</label>
      <div class="relative">
        <div
          class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none"
        >
          <svg
            class="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          id="table-search-users"
          class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search country name"
          v-model="searchQuery"
        />
      </div>
      <div class="flex space-x-2">
        <p class="px-4 py-2 text-sm">
          {{ `${currentPage} / ${totalPages} pages` }}
        </p>
        <!-- button for next and previous  -->
        <div>
          <button
            @click="previousPage"
            :disabled="currentPage.value === 1"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Previous
          </button>
          <!-- show input current page -->
          <input
            type="text"
            class="w-16 px-2 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
            v-model="currentPage"
          />
          <button
            @click="nextPage"
            :disabled="
              currentPage.value ===
              Math.ceil(totalItems.value / itemsPerPage.value)
            "
            class="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    <div class="overflow-auto h-[70vh]">
      <table
        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center">
                <a href="#" class="flex items-center" @click="toggleSort">
                  Country
                  <svg
                    class="w-3 h-3 ms-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <template v-if="isAscSort">
                      <!-- down -->
                      <path
                        fill-rule="evenodd"
                        d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z"
                        clip-rule="evenodd"
                      />
                    </template>
                    <template v-else>
                      <!-- up -->
                      <path
                        fill-rule="evenodd"
                        d="M5.575 13.729C4.501 15.033 5.43 17 7.12 17h9.762c1.69 0 2.618-1.967 1.544-3.271l-4.881-5.927a2 2 0 0 0-3.088 0l-4.88 5.927Z"
                        clip-rule="evenodd"
                      />
                    </template></svg
                ></a>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">cca2</th>
            <th scope="col" class="px-6 py-3">cca3</th>
            <th scope="col" class="px-6 py-3">native name</th>
            <th scope="col" class="px-6 py-3">alternative spellings</th>
            <th scope="col" class="px-6 py-3">idd</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            v-for="(item, i) in currentPageItems"
            @click="showModal(item)"
            :key="i"
          >
            <th
              scope="row"
              class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
            >
              <img
                class="w-10 h-10 rounded-full object-contain"
                :src="item.flags"
                alt="Jese image"
              />
              <div class="ps-3">
                <div class="text-base font-semibold">{{ item.area }}</div>
                <div class="font-normal text-gray-500">
                  {{ item.name }}
                </div>
              </div>
            </th>
            <td class="px-6 py-4">{{ item.cca2 }}</td>
            <td class="px-6 py-4">{{ item.cca3 }}</td>
            <!-- display the offciall name in side the object first key-->
            <td class="px-6 py-4">
              {{ getNativeName(item) }}
            </td>
            <td class="px-6 py-4">{{ getAltSpelling(item) }}</td>
            <td class="px-6 py-4">{{ getIdd(item) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
