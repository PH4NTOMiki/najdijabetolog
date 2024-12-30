<script>
    import { Check, MessageSquare, Star, Target } from 'lucide-svelte';

    const features = [
        {
            text: "Predlagati dijabetologe i zdravstvene ustanove putem jednostavnog obrasca.",
            icon: Target
        },
        {
            text: "Ostaviti komentare i ocjene za dijabetologe koje su posjetili.",
            icon: Star
        },
        {
            text: "Podijeliti svoja iskustva o kvaliteti usluge, stručnosti i pristupu pacijentima.",
            icon: MessageSquare
        }
    ];

    const goals = [
        {
            title: "Javna pohvala",
            description: "Dijabetolozi s pozitivnim komentarima dobivaju priznanje za kvalitetu svog rada te dodatnu motivaciju za nastavak pružanja izvrsne skrbi.",
            icon: Star
        },
        {
            title: "Povratne informacije",
            description: "Dijabetolozi s manje pozitivnim komentarima dobivaju priliku za uvid u područja koja mogu poboljšati i prilagoditi pristup prema pacijentima.",
            icon: MessageSquare
        },
        {
            title: "Mogućnost izbora",
            description: "Pacijenti mogu uspoređivati dijabetologe prema ocjenama i komentarima drugih korisnika, olakšavajući donošenje odluke pri odabiru liječnika ili zdravstvene ustanove.",
            icon: Check
        }
    ];
</script>

<svelte:head>
    <title>O nama - NajDijabetolog.com</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <main class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Hero Section -->
        <div class="w-full max-w-3xl mx-auto text-center mb-12">
            <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                O nama
            </h1>
            <p class="text-left text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                NajDijabetolog.com je portal namijenjen pacijentima za razmjenu iskustava o dijabetolozima i zdravstvenim ustanovama koje se bave liječenjem dijabetesa. Cilj portala je pomoći osobama s dijabetesom da pronađu stručnjake koji najbolje odgovaraju njihovim potrebama te unaprijediti kvalitetu zdravstvenih usluga vezanih uz dijabetes.
            </p>
        </div>

        <!-- Features Section -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-12 w-full">
            <div class="p-8">
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                    Na portalu korisnici mogu:
                </h2>
                <div class="space-y-6 w-full">
                    {#each features as feature}
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                                <svelte:component this={feature.icon} size={24} />
                            </div>
                            <p class="text-base sm:text-lg text-gray-700 dark:text-gray-300">{feature.text}</p>
                        </div>
                    {/each}
                </div>
            </div>
        </section>

        <!-- Goals Grid -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {#each goals as goal}
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform hover:scale-105">
                    <div class="text-blue-600 dark:text-blue-400 mb-4">
                        <svelte:component this={goal.icon} size={32} />
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        {goal.title}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300">
                        {goal.description}
                    </p>
                </div>
            {/each}
        </section>

        <!-- Info Sections -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div class="p-6">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Za dijabetologe
                    </h2>
                    <p class="text-gray-600 dark:text-gray-300">
                        Portal omogućuje dijabetolozima da odgovore na komentare pacijenata, zatraže dodatna pojašnjenja ili zatraže uklanjanje svog profila u slučaju neslaganja.
                    </p>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div class="p-6">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Jednostavno korištenje
                    </h2>
                    <p class="text-gray-600 dark:text-gray-300">
                        Za korištenje portala nije potrebna registracija. Pacijenti mogu brzo i lako ostaviti komentare te pomoći drugima da pronađu stručnu i empatičnu podršku u liječenju dijabetesa.
                    </p>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="w-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center">
            <p class="text-xl sm:text-2xl text-white font-bold mb-6">
                Podijelite svoja iskustva na NajDijabetolog.com i doprinesite razvoju bolje zdravstvene skrbi za sve osobe s dijabetesom!
            </p>
            <a 
                href="/doctors" 
                class="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300"
            >
                Pregledajte dijabetologe
            </a>
        </section>
    </main>
</div>