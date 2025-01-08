<script>
    /** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

    // Helper function to generate an array of stars
    function renderStars(/** @type {number} */rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push('filled'); // Fully filled star
            } else if (rating > i - 1 && rating < i) {
                stars.push('half'); // Half-filled star
            } else {
                stars.push('empty'); // Empty star
            }
        }
        return stars;
    }
</script>
<svelte:head><title>{data.institution.name} - Najbolji dijabetolozi u Vašem gradu</title></svelte:head>

<div class="container mx-auto px-4 py-12">
    <!-- Institution Details -->
    <div class="mb-12">
        <h1 class="text-4xl font-bold text-gray-800">{data.institution.name}</h1>
        <p class="text-gray-600 text-lg">{data.institution.city.name}</p>
        <p class="text-gray-600 text-lg">{data.institution.bio}</p>
        <p class="text-yellow-500 font-bold text-xl mt-2">⭐ {data.institution.rating.toFixed(1)}</p>
    </div>

    <h2 class="text-3xl font-bold text-gray-800 mb-6">Dijabetolozi u ustanovi {data.institution.name}</h2>
    <!-- Doctors List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#if data.doctors.length}
            {#each data.doctors as doctor}
            <a href="/doktori/{doctor.id}">
                <div class="p-6 border rounded-lg bg-white hover:shadow-2xl transform hover:-translate-y-2 transition duration-200">
                    <h3 class="text-2xl font-bold text-gray-800">{doctor.first_name} {doctor.last_name}</h3>
                    <p class="text-gray-600 italic">{doctor.institution.name}</p>
                    <!-- Overall Rating -->
                    <div>
                        <p class="text-yellow-500 font-bold text-xl mb-2">⭐ {doctor.rating.toFixed(1)} - Ukupna ocjena</p>

                        <!-- Ratings by Category -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {#each [
                                { label: 'Stručnost', rating: doctor.ratingskill },
                                { label: 'Ljubaznost', rating: doctor.ratingkindness },
                                { label: 'Etičnost', rating: doctor.ratingethicality },
                                { label: 'Ustanova', rating: doctor.institution.rating },
                            ] as category}
                                <div class="text-center">
                                    <p class="text-sm text-gray-600">{category.label}</p>
                                    <div class="flex justify-center space-x-1 mt-1" aria-label={`Rating: ${category.rating} out of 5`}>
                                        {#each renderStars(category.rating) as type}
                                            {#if type === 'half'}
                                                <!-- Half-Filled Star -->
                                                <svg
                                                    class="w-6 h-6 text-gray-300"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <defs>
                                                        <clipPath id="half-clip">
                                                            <rect x="0" y="0" width="12" height="24" />
                                                        </clipPath>
                                                    </defs>
                                                    <path
                                                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                                        clip-path="url(#half-clip)"
                                                        fill="#eab308"
                                                    />
                                                    <path
                                                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="1.5"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                            {:else}
                                                <!-- Fully or Empty Star -->
                                                <svg
                                                    class="w-6 h-6 {type === 'filled' ? 'text-yellow-500' : 'text-gray-300'}"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                                        fill="{type === 'filled' ? 'currentColor' : 'none'}"
                                                        stroke="currentColor"
                                                        stroke-width="1.5"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                            {/if}
                                        {/each}
                                    </div>
                                    <p class="text-sm text-gray-600">{category.rating.toFixed(1)}</p>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </a>
            {/each}
        {:else}
            <p class="text-gray-500">Ne možemo pronaći najbolje dijabetologe u Vašem gradu.</p>
        {/if}
    </div>
</div>
