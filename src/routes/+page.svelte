<script>
    /** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<h1 class="text-4xl font-bold text-center my-8">Welcome to Doctor Rankings</h1>

<div class="container mx-auto px-4 space-y-12">
    <!-- Top Doctors Section -->
    <section>
        <h2 class="text-2xl font-semibold mb-4">Top Doctors</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#if data.topDoctors.length}
                {#each data.topDoctors as doctor}
                    <div class="p-4 border rounded-lg shadow-md hover:shadow-lg">
                        <h3 class="text-xl font-bold">{doctor.name}</h3>
                        <p class="text-gray-700">{doctor.specialization}</p>
                        <p class="text-yellow-500 font-semibold">⭐ {doctor.rating.toFixed(1)}</p>
                    </div>
                {/each}
            {:else}
                <p class="text-gray-500">No doctors available.</p>
            {/if}
        </div>
    </section>

    <!-- Popular Hospitals Section -->
    <section>
        <h2 class="text-2xl font-semibold mb-4">Popular Hospitals</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#if data.popularHospitals.length}
                {#each data.popularHospitals as hospital}
                    <div class="p-4 border rounded-lg shadow-md hover:shadow-lg">
                        <h3 class="text-xl font-bold">{hospital.name}</h3>
                        <p class="text-gray-700">Located in {hospital.city}</p>
                        <p class="text-gray-500">{hospital.doctors} doctors</p>
                    </div>
                {/each}
            {:else}
                <p class="text-gray-500">No hospitals available.</p>
            {/if}
        </div>
    </section>

    <!-- Top Cities Section -->
    <section>
        <h2 class="text-2xl font-semibold mb-4">Top Cities</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#if data.topCities.length}
                {#each data.topCities as city}
                    <div class="p-4 border rounded-lg shadow-md hover:shadow-lg">
                        <h3 class="text-xl font-bold">{city.name}</h3>
                        <p class="text-gray-500">{city.hospitals} hospitals</p>
                    </div>
                {/each}
            {:else}
                <p class="text-gray-500">No cities available.</p>
            {/if}
        </div>
    </section>
</div>