<script>
    /** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
    let { doctor, reviews } = data;

    // Helper function to render stars
    function renderStars(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? 'filled' : 'empty');
        }
        return stars;
    }
</script>
<svelte:head><title>{doctor.first_name} {doctor.last_name} - Najbolji dijabetolozi u Vašem gradu</title></svelte:head>

<div class="container mx-auto px-4 py-12">
    <!-- Doctor Profile -->
    <div class="flex flex-col md:flex-row items-center md:items-start md:space-x-8 mb-12">
        <div class="w-40 h-40 md:w-60 md:h-60 bg-blue-100 rounded-full flex-shrink-0 overflow-hidden">
            <img
                src={`https://via.placeholder.com/150?text=${doctor.first_name}`}
                alt="{doctor.first_name} {doctor.last_name}"
                class="w-full h-full object-cover"
            />
        </div>

        <div class="flex-1 space-y-4">
            <h1 class="text-4xl font-bold text-gray-800">{doctor.first_name} {doctor.last_name}</h1>
            <p class="text-gray-600">{doctor.bio}</p>
            <p class="text-yellow-500 font-bold text-xl">⭐ {doctor.rating.toFixed(1)}</p>
        </div>
    </div>

    <!-- Reviews Section -->
    <div>
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Recenzije</h2>

        {#if reviews.length}
            <div class="space-y-6">
                {#each reviews as review}
                    <div class="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition">
                        <h3 class="text-lg font-bold text-gray-800">{review.created_by}</h3>

                        <div class="flex space-x-4 text-gray-600">
                            <p>Stručnost:</p>
                            <div class="flex">
                                {#each renderStars(review.ratingSkill) as star, i}
                                    <svg
                                        class="w-5 h-5 {star === 'filled' ? 'text-yellow-500' : 'text-gray-300'}"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="{star === 'filled' ? 'currentColor' : 'none'}"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="1"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                        />
                                    </svg>
                                {/each}
                            </div>
                        </div>

                        <div class="flex space-x-4 text-gray-600">
                            <p>Ljubaznost:</p>
                            <div class="flex">
                                {#each renderStars(review.ratingKindness) as star, i}
                                    <svg
                                        class="w-5 h-5 {star === 'filled' ? 'text-yellow-500' : 'text-gray-300'}"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="{star === 'filled' ? 'currentColor' : 'none'}"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="1"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                        />
                                    </svg>
                                {/each}
                            </div>
                        </div>

                        <div class="flex space-x-4 text-gray-600">
                            <p>Etičnost:</p>
                            <div class="flex">
                                {#each renderStars(review.ratingEthicality) as star, i}
                                    <svg
                                        class="w-5 h-5 {star === 'filled' ? 'text-yellow-500' : 'text-gray-300'}"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="{star === 'filled' ? 'currentColor' : 'none'}"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="1"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                        />
                                    </svg>
                                {/each}
                            </div>
                        </div>

                        <div class="flex space-x-4 text-gray-600">
                            <p>Ustanova:</p>
                            <div class="flex">
                                {#each renderStars(review.ratingInstitution) as star, i}
                                    <svg
                                        class="w-5 h-5 {star === 'filled' ? 'text-yellow-500' : 'text-gray-300'}"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="{star === 'filled' ? 'currentColor' : 'none'}"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="1"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                        />
                                    </svg>
                                {/each}
                            </div>
                        </div>

                        <p class="text-gray-600 mt-2">{review.comment}</p>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="text-gray-500">Ovaj dijabetolog još nema recenzija.</p>
        {/if}
    </div>
</div>