<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import { onMounted, ref } from "vue";

onMounted(async () => {
  await fetchData();
});

function fetchData() {
  console.log("Fetching data...");

  // curl restcountries.com/v3.1/all into public/contries.json
  // because the restcountries.com API is not working
  fetch("/contries.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
}
</script>

<template>
  <div><h1>Hello World</h1></div>
</template>
