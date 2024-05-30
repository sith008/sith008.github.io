<script setup>
import { watch, onBeforeMount, onMounted, ref, computed } from "vue";

// paginate
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const items = ref([]);

// create a computeed property to calculate the current page items
const currentPageItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return items.value.slice(start, end);
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

// sort countries by name.official asc by default
function sortCountriesByNameAsc() {
  console.log(items.value[0]);
  //fin null in name
  const nullC = items.value.filter((item) => item.name == null);
  console.log("Country with null name");
  console.log(nullC);
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
    console.log("Error in idd");
    console.log(item);
    return "";
  }
}

// Lifecycle hooks

onBeforeMount(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("page");
  currentPage.value = page ? parseInt(page) : 1;
});

onMounted(async () => {
  try {
    const response = await fetch("/countries.json");
    const data = await response.json();

    // setup pagination
    totalItems.value = data.length;
    items.value = mapJsonToData(data);

    sortCountriesByNameAsc();

    console.log("Finished fetching data");
    console.log(totalItems.value);
    console.log(items.value[0]);
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
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
        />
      </div>
    </div>
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">
            <div class="flex items-center">
              Color
              <a href="#"
                ><svg
                  class="w-3 h-3 ms-1.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                  /></svg
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
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          v-for="(item, i) in currentPageItems"
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
      </tbody>
    </table>
  </div>
</template>
