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
    items.value = data;

    console.log("Finished fetching data");
    console.log(totalItems.value);
    console.log(typeof data);
    console.log(data[0]);
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
      <div>
        <button
          id="dropdownActionButton"
          data-dropdown-toggle="dropdownAction"
          class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          type="button"
        >
          <span class="sr-only">Action button</span>
          Action
          <svg
            class="w-2.5 h-2.5 ms-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        <!-- Dropdown menu -->
        <div
          id="dropdownAction"
          class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
        >
          <ul
            class="py-1 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownActionButton"
          >
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >Reward</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >Promote</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >Activate account</a
              >
            </li>
          </ul>
          <div class="py-1">
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >Delete User</a
            >
          </div>
        </div>
      </div>
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
          placeholder="Search for users"
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
          <th scope="col" class="p-4">
            <div class="flex items-center">
              <input
                id="checkbox-all-search"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label for="checkbox-all-search" class="sr-only">checkbox</label>
            </div>
          </th>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">Position</th>
          <th scope="col" class="px-6 py-3">Status</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          v-for="(item, i) in currentPageItems"
          :key="i"
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                id="checkbox-table-search-1"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label for="checkbox-table-search-1" class="sr-only"
                >checkbox</label
              >
            </div>
          </td>
          <th
            scope="row"
            class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
          >
            <img class="w-10 h-10 rounded-full" src="" alt="Jese image" />
            <div class="ps-3">
              <div class="text-base font-semibold">{{ item.area }}</div>
              <div class="font-normal text-gray-500">
                neil.sims@flowbite.com
              </div>
            </div>
          </th>
          <td class="px-6 py-4">React Developer</td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
              Online
            </div>
          </td>
          <td class="px-6 py-4">
            <a
              href="#"
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit user</a
            >
          </td>
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
