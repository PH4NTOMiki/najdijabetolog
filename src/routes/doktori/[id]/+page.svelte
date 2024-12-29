<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    // Helper function to generate an array of stars (keeping the existing function)
    function renderStars(/** @type {number} */rating) {
        const stars = [];
        const fullStars = Math.floor(rating);
        const decimal = rating - fullStars;
        const showHalfStar = decimal >= 0.5 && fullStars < 5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push('filled');
            } else if (i === fullStars + 1 && showHalfStar) {
                stars.push('half');
            } else {
                stars.push('empty');
            }
        }
        return stars;
    }

    let isModalOpen = $state(false);
    let newReview = $state({
        email: '',
        ratingskill: 0,
        ratingkindness: 0,
        ratingethicality: 0,
        ratinginstitution: 0,
        comment: '',
        created_by: ''
    });
    let successMessage = $state('');
    let errorMessage = $state('');
    
    function openModal() {
        isModalOpen = true;
        // Reset form when opening modal
        newReview = {
            email: '',
            ratingskill: 0,
            ratingkindness: 0,
            ratingethicality: 0,
            ratinginstitution: 0,
            comment: '',
            created_by: ''
        };
        successMessage = '';
        errorMessage = '';
    }

    function closeModal() {
        isModalOpen = false;
    }

    /**
     * @param {{ preventDefault: () => void; }} ev
     */
    async function submitReview(ev) {
        ev.preventDefault();
        successMessage = '';
        errorMessage = '';

        try {
            if (!data.doctor.id || !newReview.email || !data.doctor.institution.id || !newReview.ratingskill || !newReview.ratingkindness || !newReview.ratingethicality || !newReview.ratinginstitution || !newReview.comment || !newReview.created_by) {
                throw new Error('Molimo popunite sva polja.');
            }
            
            const response = await fetch(`/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctor_id: data.doctor.id,
                    institution_id: data.doctor.institution.id,
                    ...newReview
                })
            });

            if (!response.ok) throw new Error((await response.json()).error);

            const addedReview = await response.json();
            console.log(addedReview);
            successMessage = 'Hvala vam! Vaša recenzija je uspješno dodana. Da bi bila vidljiva, morate potvrditi Vaš email.';
            // Close modal after short delay to show success message
            setTimeout(() => {
                closeModal();
            }, 5000);
        } catch (error) {
            // @ts-ignore
            errorMessage = error.message || 'Došlo je do greške prilikom dodavanja recenzije.';
        }
    }
</script>

<svelte:head>
    <title>{data.doctor.first_name} {data.doctor.last_name} - Najbolji dijabetolozi u Vašem gradu</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
    <!-- Doctor Profile -->
    <div class="flex flex-col md:flex-row items-center md:items-start md:space-x-8 mb-12">
        <div class="w-40 h-40 md:w-60 md:h-60 bg-blue-100 rounded-full flex-shrink-0 overflow-hidden">
            <img
                src={`https://placehold.co/150x150@2x.png?text=${data.doctor.first_name}`}
                alt="{data.doctor.first_name} {data.doctor.last_name}"
                class="w-full h-full object-cover"
            />
        </div>

        <div class="flex-1 space-y-6">
            <div>
                <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-300">{data.doctor.first_name} {data.doctor.last_name}</h1>
                <h2 class="text-2xl text-gray-600 dark:text-gray-200"><a href="/ustanove/{data.doctor.institution.id}">{data.doctor.institution.name}</a></h2>
                <p class="text-gray-600 dark:text-gray-200">{data.doctor.bio}</p>
            </div>

            <!-- Overall Rating -->
            <div>
                <p class="text-yellow-500 font-bold text-xl mb-2">⭐ {data.doctor.rating.toFixed(1)} - Ukupna ocjena</p>

                <!-- Ratings by Category -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {#each [
                        { label: 'Stručnost', rating: data.doctor.ratingskill },
                        { label: 'Ljubaznost', rating: data.doctor.ratingkindness },
                        { label: 'Etičnost', rating: data.doctor.ratingethicality },
                        { label: 'Ustanova', rating: data.doctor.institution.rating },
                    ] as category}
                        <div class="text-center">
                            <p class="text-sm text-gray-600 dark:text-gray-200">{category.label}</p>
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
                            <p class="text-sm text-gray-600 dark:text-gray-200">{category.rating.toFixed(1)}</p>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <!-- Add Review Button -->
    <div class="mt-12 mb-12">
        <button
            onclick={openModal}
            class="py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            Dodajte recenziju
        </button>
    </div>

    <!-- Modal -->
    {#if isModalOpen}
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-bold text-gray-800">Dodajte recenziju</h2>
                        <button
                            onclick={closeModal}
                            class="text-gray-500 hover:text-gray-700"
                            aria-label="Close modal"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {#if successMessage}
                        <div class="p-4 mb-6 bg-green-100 text-green-700 rounded">{successMessage}</div>
                    {/if}
                    {#if errorMessage}
                        <div class="p-4 mb-6 bg-red-100 text-red-700 rounded">{errorMessage}</div>
                    {/if}

                    <form onsubmit={submitReview} class="space-y-4">
                        <!-- Created By -->
                        <div>
                            <label for="created_by" class="block text-sm font-medium text-gray-700">Vaše ime</label>
                            <input
                                id="created_by"
                                type="text"
                                bind:value={newReview.created_by}
                                required
                                class="border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        
                        <!-- Email -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                bind:value={newReview.email}
                                required
                                class="border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <!-- Ratings -->
                        {#each [
                            { label: 'Stručnost', key: 'ratingskill' },
                            { label: 'Ljubaznost', key: 'ratingkindness' },
                            { label: 'Etičnost', key: 'ratingethicality' },
                            { label: 'Ustanova', key: 'ratinginstitution' }
                        ] as category}
                            <div>
                                <label class="block text-sm font-medium text-gray-700">{category.label}</label>
                                <div class="flex items-center mt-2 space-x-1">
                                    {#each Array(5) as _, i}
                                        <svg role="button" tabindex="0"
                                            onclick={() => (newReview[category.key] = i + 1)}
                                            onkeyup={() => (newReview[category.key] = i + 1)}
                                            class="w-6 h-6 cursor-pointer {i < newReview[category.key] ? 'text-yellow-500' : 'text-gray-300'}"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="{i < newReview[category.key] ? 'currentColor' : 'none'}"
                                            viewBox="0 0 24 24"
                                            stroke="{i < newReview[category.key] ? 'none' : 'currentColor'}"
                                            stroke-width="1.5"
                                        >
                                            <path
                                                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    {/each}
                                </div>
                            </div>
                        {/each}

                        <!-- Comment -->
                        <div>
                            <label for="comment" class="block text-sm font-medium text-gray-700">Komentar</label>
                            <textarea
                                id="comment"
                                rows="4"
                                bind:value={newReview.comment}
                                class="border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            ></textarea>
                        </div>

                        <!-- Submit Button -->
                        <div>
                            <button
                                type="submit"
                                class="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Pošaljite recenziju
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    {/if}

    <!-- Reviews Section (keeping existing code) -->
    <div>
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Recenzije</h2>

        {#if data.reviews.length}
            <div class="space-y-6">
                {#each data.reviews as review}
                    <div class="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition">
                        <h3 class="text-lg font-bold text-gray-800">{review.created_by}</h3>

                        {#each [
                            { label: 'Stručnost', rating: review.ratingskill },
                            { label: 'Ljubaznost', rating: review.ratingkindness },
                            { label: 'Etičnost', rating: review.ratingethicality },
                            { label: 'Ustanova', rating: review.ratinginstitution }
                        ] as category}
                            <div class="flex items-center space-x-4 text-gray-600 mb-2">
                                <p class="w-32 font-medium">{category.label}:</p>
                                <div class="flex" aria-label={`Rating: ${category.rating} out of 5`}>
                                    {#each renderStars(category.rating) as type}
        {#if type === 'half'}
            <svg
                class="w-6 h-6 text-yellow-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <defs>
                    <linearGradient id="halfStarGradient">
                        <stop offset="50%" stop-color="currentColor"/>
                        <stop offset="50%" stop-color="transparent"/>
                    </linearGradient>
                </defs>
                <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    fill="url(#halfStarGradient)"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        {:else}
            <svg
                class="w-6 h-6 {type === 'filled' ? 'text-yellow-500' : 'text-gray-300'}"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="{type === 'filled' ? 'currentColor' : 'none'}"
                stroke="currentColor"
                stroke-width="1.5"
            >
                <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        {/if}
    {/each}
                                </div>
                            </div>
                            
                        {/each}

                        <p class="text-gray-600 mt-2">{review.comment}</p>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="text-gray-500">Ovaj dijabetolog još nema recenzija.</p>
        {/if}
    </div>
</div>
