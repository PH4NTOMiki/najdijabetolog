<script>
    /** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>
<svelte:head><title>Najbolji dijabetolozi u Vašem gradu</title></svelte:head>

<div class="container mx-auto px-4 py-12">
    <div class="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
        <!-- Doctor Image (Placeholder) -->
        <div class="w-40 h-40 md:w-60 md:h-60 bg-blue-100 rounded-full flex-shrink-0 overflow-hidden">
            <img
                src={`https://via.placeholder.com/150?text=${data.doctor.first_name}`}
                alt="{data.doctor.first_name}"
                class="w-full h-full object-cover"
            />
        </div>

        <!-- Doctor Info -->
        <div class="flex-1 space-y-6">
            <div>
                <h1 class="text-4xl font-bold text-gray-800">{data.doctor.first_name}</h1>
                <p class="text-xl text-blue-600">{data.doctor.specialization}</p>
            </div>
            <div>
                <p class="text-gray-600">{data.doctor.bio}</p>
            </div>
            <div class="flex items-center space-x-4">
                <p class="text-yellow-500 font-bold text-xl">⭐ {data.doctor.ratings.toFixed(1)}</p>
                <p class="text-gray-500">{data.doctor.reviews} reviews</p>
            </div>
        </div>
    </div>
</div>
