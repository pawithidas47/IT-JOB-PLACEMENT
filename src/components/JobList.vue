<!-- src/components/JobList.vue -->
<template>
  <div>
    <input v-model="search" placeholder="🔍 ค้นหางาน..." />
    <ul>
      <li v-for="job in filteredJobs" :key="job.id">
        {{ job.title }} - {{ job.department }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      jobs: [
        { id: 1, title: "Frontend Developer", department: "IT" },
        { id: 2, title: "Data Assistant", department: "Science" },
      ],
    };
  },
  computed: {
    filteredJobs() {
      return this.jobs.filter((job) =>
        job.title.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
};
</script>
