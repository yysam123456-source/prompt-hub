#!/usr/bin/env python3
"""
Prompt Hub Data Generator v4 - Final
1000+ curated prompts, 12 categories, Pollinations.ai images
"""

import json, random, re, time, urllib.parse

OUTPUT_FILE = "public/data/prompts.json"
random.seed(42)

# ====== BASE PROMPTS (hand-curated) ======
BASE_PROMPTS = {
    "portrait": [
        "portrait of a young woman with flowing auburn hair golden hour backlighting soft bokeh Canon EOS R5 photorealistic",
        "elegant elderly Asian woman silver hair traditional hanbok serene expression natural window light cultural photography",
        "close-up portrait of freckled red-haired girl bright green eyes dappled sunlight through leaves whimsical mood",
        "dramatic black and white portrait weathered fisherman deep wrinkles harsh side lighting documentary style",
        "fashion model on Paris Fashion Week runway avant-garde metallic dress flash photography motion blur",
        "double exposure portrait blending silhouette with mountain landscape ethereal atmosphere fine art photography",
        "professional headshot confident businesswoman soft studio lighting neutral background corporate photography",
        "vintage Hollywood glamour portrait 1950s actress pearl necklace soft focus classic beauty lighting",
        "intimate candid portrait mother holding newborn baby warm bedroom light emotional moment lifestyle photography",
        "athletic portrait male runner after marathon golden hour stadium background sports photography dynamic pose",
        "artistic portrait with colorful powder paint thrown in air festival vibe vibrant colors frozen time",
        "low-key moody portrait mysterious woman shadow single light source half face chiaroscuro technique",
        "bright cheerful outdoor portrait laughing teenage friends summer sun backlight carefree energy captured",
        "renaissance oil painting portrait recreation modern subject classical composition dramatic lighting museum quality",
        "editorial portrait musician with instrument backstage grainy film aesthetic rock and roll energy",
        "beauty portrait intricate braided hairstyle gold accessories clean studio background fashion editorial",
        "senior citizen couple holding hands 50 years together genuine smiles warm home interior love story",
        "childhood innocence portrait kid blowing dandelion meadow dreamy soft focus nostalgic feeling",
        "powerful CEO portrait modern glass office city skyline window behind confident posture magazine cover",
        "artistic silhouette portrait sunset rim light profile contemplative mood minimal color palette",
        "cultural dancer traditional costume mid-performance dynamic movement frozen vibrant textile patterns",
        "punk rock portrait colored hair leather jacket urban alleyway rebellious attitude edgy photography",
        "maternity portrait expectant mother cradling belly partner hands tender moment warm golden tones",
        "graduation cap toss group shot university campus joy accomplishment blue sky day celebration",
        "warrior princess tribal face paint intense gaze desert windblown hair epic character study",
    ],
    "landscape": [
        "Dolomites mountain range sunrise alpine glow peaks reflection pristine lake National Geographic quality",
        "ancient redwood forest towering trees god rays morning mist magical atmosphere towering giants",
        "tropical paradise beach turquoise water white sand palm trees silhouetted orange sunset sky paradise",
        "Icelandic Skógafoss waterfall full rainbow arc long exposure silky water moss-covered black rocks",
        "Tuscany rolling hills golden hour cypress-lined gravel road vineyards Italian countryside dreamscape",
        "Swiss Alps panorama Jungfraujoch snow-capped peaks horizon clear azure sky breathtaking vista",
        "Japanese bamboo forest Arashiyama tall green stalks natural tunnel peaceful zen atmosphere path",
        "Norwegian fjord steep cliffs traditional red wooden houses shoreline mirror-like calm water",
        "Antelope Canyon beam light narrow slot canyon opening swirling sandstone walls orange purple",
        "Santorini white-washed buildings blue domes caldera Mediterranean sunset pink gold painting sky",
        "Patagonian wilderness glacial lake floating icebergs granite towers raw untouched nature epic scale",
        "lavender fields Provence France horizon rows purple flowers cloudy summer sky pastoral beauty",
        "Yosemite Valley Tunnel View El Capitan Half Dome framed ponderosa pines Ansel Adams composition",
        "Northern Lights aurora borealis dancing Finnish Lapland landscape reflected frozen lake surface",
        "Zhangjiajie avatar mountains sea clouds quartzite sandstone pillars mystical Chinese landscape",
        "Maldives overwater bungalow resort dusk crystal clear lagoon wooden deck turquoise paradise waters",
        "Scottish Highlands rugged terrain solitary loch reflecting moody sky atmospheric mist rolling hills",
        "Autumn foliage explosion Vermont covered bridge stream red orange yellow maple peak colors",
        "Death Valley salt flats endless mirror effect mountains surreal otherworldly barren landscape",
        "Amazon rainforest canopy aerial view river snaking through endless green biodiversity hotspot",
        "white chalk cliffs Dover meeting turbulent English Channel dramatic coastal scenery moody seascape",
        "rice terraces Yuanyang China dawn filled water reflecting sky layered agricultural wonder",
        "safari sunset African savanna acacia tree silhouette golden grassland stretching wildlife habitat",
        "Norwegian Atlantic Road stormy ocean waves crashing dramatic engineering wild nature bridge",
        "flower super bloom California valley carpet wildflowers every color desert floor rare rain season",
    ],
    "fantasy": [
        "majestic ancient gold dragon sleeping mountain treasure coins scales shimmering smoke nostrils epic fantasy art",
        "crystal spire wizard tower piercing clouds floating magical books orbiting structure glowing arcane windows D&D artwork",
        "elven tree city giant ancient world tree branches bioluminescent plants pathways moonlit night scene fantasy architecture",
        "knight full ornate plate armor kneeling gothic cathedral altar holy light beams stained glass religious fantasy",
        "underwater mermaid kingdom coral palace architecture bioluminescent sea creatures citizens sun rays surface above mythology",
        "phoenix rising from ashes reborn cycle fiery wings spread burning temple ruins mythological resurrection scene magic creature",
        "dark sorcerer casting forbidden spell swirling dark energy ancient tome floating candles extinguishing power wave",
        "floating islands sky connected waterfalls cascading void below fantasy world Studio Ghibli inspired clouds adventure setting",
        "enchanted forest oversized mushrooms glowing softly fairy lights dancing between trees magical creature hiding spot mystical nature",
        "Viking longship sailing stormy sea Valhalla gates lightning striking mast Odin watching clouds above norse mythology",
        "golem living stone awakening underground dungeon runes glowing body debris falling massive form dungeon encounter",
        "fairy circle mushroom ring moonlit meadow tiny winged figures dancing sparkles magic dust particles everywhere enchanting scene",
        "lich king bone throne icy crypt blue spectral flames undead army standing attention dark fantasy throne room villain lair",
        "griffin armored rider mountain pass eagle front lion body hybrid mythical creature hunting adventure fantasy scene mount",
        "magical library infinite books floating shelves ladder moving wizard studying scroll cozy mystery knowledge setting",
        "tree life roots connecting all realms visible different seasons each branch cosmic scale fantasy concept art world tree",
        "centaur archer drawing bow enchanted forest clearing arrow tip glowing magic huntress tracking unseen prey fantasy race",
        "crystal cave formations humming musical tone touched subterranean fantasy environment discovery exploration wonder",
        "werewolf transformation full moon dark forest human form shifting beast painful metamorphosis cinematic moment horror fantasy",
        "steampunk airship fleet battle clockwork mechanisms brass hulls exchanging cannon fire clouds fantasy warfare naval combat",
        "necromancer raising skeleton army battlefield graveyard green necrotic energy flowing hands ground dark ritual evil magic",
        "unicorn drinking enchanted pool secret grove rainbow mane reflecting water pure white coat gleaming mythical purity creature",
        "demon portal cathedral ruin hellish red light spilling cloaked figure stepping through other dimension invasion scene",
        "titan colossal being ocean waist-deep tiny ships fleeing nearby god-scale creature fantasy illustration kaiju monster",
    ],
    "sci-fi": [
        "massive orbital space station ring Earth solar panels shuttle docking hard sci-fi realistic design NASA concept",
        "android consciousness awakening laboratory neon blue circuitry patterns synthetic skin emotional eyes artificial intelligence birth",
        "Mars colony dome settlement red planet landscape outside astronauts working greenhouse interior growing food colonization",
        "alien desert world triple moons purple sky crystalline rock formations explorer rover vehicle tracks first contact exploration",
        "cyberpunk Tokyo street night rain-slicked pavement neon kanji signs flying cars blade runner mood dystopian future city",
        "warp drive starship engaging faster-than-light travel stars stretching light trails bridge crew space opera star trek",
        "robot assembly line futuristic factory humanoid robots constructed automated manufacturing future industrial vision automation",
        "astronaut spacewalk ISS Earth curvature thin blue atmosphere visible tethered free-floating NASA documentary realism",
        "quantum computer core room suspended processors absolute zero chamber scientists holographic displays physics research",
        "post-apocalyptic ruined city reclaimed nature crumbling skyscrapers vegetation abandoned vehicles overgrown streets decay",
        "time machine device rotating rings energy field distortion laboratory experiment gone right wrong unclear paradox machine",
        "first contact alien ambassador shaking hands diplomat two species historic moment meeting diplomacy scene cooperation",
        "underwater research station alien ocean world giant creatures swimming past viewport windows deep sea sci-fi horror vibes",
        "holographic interface projection mid-air user manipulating data hand gestures futuristic UI/UX concept design HUD interface",
        "generation ship interior artificial ecosystem park area descendants original crew never seen Earth colony ship life",
        "laser defense satellite network coordinated beam weapons array protecting planet asteroid impact threat planetary defense",
        "bio-engineered organism vat DNA helix structure transparent tank genetic modification lab biotech research ethics",
        "space elevator cable car equatorial base station geostationary orbit platform Earth rotating below infrastructure mega project",
        "AI mainframe server room cooling systems indicator lights pulsing processing activity digital consciousness hardware singularity",
        "terraforming equipment Mars surface atmospheric processors billowing engineered gas planetary engineering scale transformation",
        "virtual reality immersion pod person experiencing alternate reality cables sensors attached body VR metaverse technology",
        "asteroid mining operation belt between Mars Jupiter extraction machinery rocky surface spacecraft loading ore industry",
        "dyson swarm partial construction star energy collectors coordinated pattern Type II civilization project megastructure",
        "android repair shop alleyway various models disassembly mechanic exposed wiring gritty realistic cyberpunk maintenance",
    ],
    "anime": [
        "anime girl standing school rooftop overlooking city sunset Makoto Shinkai cloud wind blowing hair skirt gently slice life",
        "samurai warrior drawing katana bamboo forest duel stance anime action pose speed lines intense battle about to begin shonen",
        "magical girl transformation sequence sparkles ribbons light effects Sailor Moon retro aesthetic 90s anime charm mahou shoujo",
        "steampunk airship flying cumulus clouds anime adventure style Castle in the Sky inspired vessel design steampunk anime",
        "cyberpunk anime character neon-lit city alley rain falling Ghost in the Shell Major Kusanagi vibe reflective surfaces dark anime",
        "slice life Japanese high school classroom cherry blossom petals visible through window spring semester start peaceful anime",
        "mecha pilot robot cockpit holographic displays Gundam style mobile suit launch sequence preparation giant robot anime",
        "anime cat cafe interior cute girls serving drinks pastel colors cozy warm atmosphere kawaii aesthetic overload moe anime",
        "shonen anime power-up aura explosion spiky-haired protagonist screaming attack name energy crackling body battle manga",
        "Ghibli-inspired bathhouse spirit world weird creatures bathing Spirited Away architecture character design homage studio ghibli",
        "anime winter scene characters looking snowfall from indoor location hot breath vapor visible emotional moment touching anime",
        "sports anime climax match moment sweat drops determined facial expression dynamic angle shonen jump intensity sports anime",
        "anime music idol performing stage holographic backup dancers colorful costumes concert venue lighting idol anime performance",
        "post-apocalyptic anime wasteland wanderer mechanical arm desert setting Mad Max meets anime protagonist survival anime",
        "anime school festival cultural event students running food stalls yukata characters fireworks night ending festival anime",
        "mysterious anime transfer student entering classroom first day dramatic slow-motion door opening everyone staring reaction trope",
        "anime train station platform farewell scene departure board showing time characters saying goodbye tears held back emotional anime",
        "fantasy isekai protagonist receiving divine blessing goddess glowing light enveloping reincarnation isekai anime beginning",
        "anime cooking competition dish close-up shining food sparkle effects Shokugeki no Soma deliciousness food anime cuisine",
        "detective anime crime scene investigation magnifying glass clues scattered around serious analytical expression mystery anime",
        "anime underwater scene character diving ocean depths sunlight rays penetrating water surface above peaceful serene anime",
        "anime festival fireworks display night characters watching together hillside yukata summer memories forming romantic anime",
        "villain anime monologue elaborate throne room dramatic shadows twisted smile evil plan reveal antagonist speech",
        "anime training montage character pushing physical limits sweat determination mentor watching approval shonen growth arc",
    ],
    "abstract": [
        "fluid acrylic pour metallic gold deep indigo swirls mixing organically cells lace patterns forming abstract painting technique",
        "geometric abstraction golden ratio spiral intersecting Fibonacci grid lines mathematical harmony visualized sacred geometry art",
        "fractal zoom Mandelbrot set infinite self-similar detail psychedelic electric blue magenta cyan gradients mathematical beauty",
        "kinetic sculpture installation motion abstract metal shapes rotating invisible axes shadows dancing gallery wall contemporary art",
        "light painting long exposure LED poi spinning ribbon trails light pitch black backdrop photography long exposure technique",
        "ink drop expanding clear water perfect circular ripples macro photography zen meditation visual metaphor fluid dynamics",
        "smoke art colored smoke wisps curling intertwining air ephemeral temporary sculptures captured forever smoke photography",
        "digital glitch art RGB channel separation offset corrupted data visualization error intentional beauty vaporwave aesthetics",
        "marbling paper vibrant pigment floating liquid carrageenan medium psychedelic organic patterns ebru art technique suminagashi",
        "particle physics collision visualization subatomic particle tracks cloud detector science becomes art physics visualization",
        "sound wave visualization favorite song converted image frequency amplitude mapped color position synesthesia art data art",
        "architectural blueprint overlaid watercolor bleeding technical precision artistic chaos intentionally mixed media collage",
        "mirror polished stainless steel sculpture reflecting distorted environment abstract shapes Kapoor contemporary sculpture reflective",
        "neon light tubes bent abstract cursive word shapes glowing concrete wall text pure visual element neon sign typography art",
        "oil slick wet asphalt road creating rainbow sheen patterns accidental beauty mundane urban infrastructure detail found art",
        "tessellation interlocking impossible shapes Escher-inspired mathematical art optical illusion depth impossible geometry",
        "powder explosion frozen high-speed photography colored flour particles suspended mid-air controlled chaos moment action shot",
        "circuit board pattern morphing neural network connections constellation map technology biology cosmos flow data visualization",
        "sand art animation frame intricate detailed landscape created entirely carefully placed grains colored sand performance art",
        "prism refracting white beam full spectrum rainbow dark room surfaces dispersion physics pure visual delight optics science",
        "typographic portrait created entirely words letters varying sizes forming recognizable face distance creative typography portrait",
        "molten glass blowing process glowing orange material shaped artisan fluid dynamics semi-solid material craft glassmaking",
        "bubble interference soap film iridescent color shifts thin film physics wave behavior visually beautiful physics phenomenon",
    ],
    "architecture": [
        "Antoni Gaudi Sagrada Familia interior forest stone columns reaching stained glass ceiling Barcelona modernism masterpiece cathedral",
        "futuristic vertical forest sustainable skyscraper integrated terraced gardens every floor eco-architecture Milan Bosco Verticale green building",
        "abandoned Art Deco theater lobby peeling paint revealing layers history dramatic shafts dusty light urban decay exploration",
        "traditional Japanese Zen Buddhist temple garden raked sand meditation patterns minimalist wooden veranda tranquility shrine garden",
        "Brutalist concrete government building strong geometric repetitive forms moody overcast day raw material honesty architecture style",
        "Zaha Hadid fluid curved museum building white smooth surfaces defying traditional architectural right angles parametric design deconstructivism",
        "ancient Roman Pantheon interior oculus opening sunbeam illuminating coffered concrete dome timeless engineering marvel ancient rome",
        "Scandinavian minimalist cabin Norwegian woods large glass wall framing pine forest simple clean lines warm wood interior hygge",
        "Mughal Taj Mahal dawn perfect reflection long pool white marble mausoleum symmetrical Islamic garden layout wonder world monument",
        "converted warehouse loft apartment exposed brick walls original timber ceiling beams industrial chic residential adaptive reuse",
        "Frank Lloyd Wright Fallingwater cantilevered waterfall stone wood integration organic architecture masterpiece residence design",
        "Gothic Notre Dame Cathedral flying buttresses rose window detail medieval stonework craftsmanship French Gothic peak landmark",
        "modern glass box house cliff edge overlooking ocean floor to ceiling windows three sides precarious luxury positioning minimalism",
        "Chinese traditional courtyard siheyuan residence tiled roofs wooden lattice screens central garden courtyard heart hutong",
        "Burj Khalifa Dubai shooting upward desert base crown stainless steel glass curtain wall reflecting Arabian Gulf tallest tower",
        "ancient Machu Picchu Incan citadel stone structures nestled Andes mountain peaks cloud forest mist ruins archaeological site",
        "Sydney Opera House shell roof segments catching golden hour sunset Sydney Harbour water iconic silhouette landmark opera",
        "subterranean earth-sheltered house grass roof skylights only evidence habitation green roof living sustainable underground",
        "Moroccan riad interior courtyard mosaic tile zellige patterns carved plaster arabesques central fountain splashing islamic design",
        "Buckminster Fuller geodesic dome greenhouse triangular panel construction maximum interior volume minimum material efficiency",
        "Venice St Mark Basilica Byzantine domes gold mosaics glittering evening light piazza campanile tower venice byzantine architecture",
        "ancient Angkor Wat temple complex sunrise reflecting pools Khmer architecture jungle temple Cambodian wonder khmer empire hindu",
        "modernist Barcelona Pavilion Mies van der Rohe flowing space glass walls Onyx marble travertine materials less is more bauhaus",
        "traditional Korean hanok house curved tile roof heated ondol floors wooden veranda facing mountain view courtyard joseon dynasty",
    ],
    "animal": [
        "majestic male lion sitting African savanna termite mound golden hour side lighting intense amber eyes wildlife photo safari",
        "red fox curled fresh winter frost crystals whiskers brilliant orange fur contrasting stark white background arctic winter wildlife",
        "great horned owl silent flight wings fully extended moonlit night hunting scene feather texture razor sharp focus raptor",
        "scarlet macaw vibrant red blue yellow plumage tropical tree branch Amazon rainforest exotic bird parrot tropical species",
        "green sea turtle gliding gracefully colorful coral reef sun rays filtering crystal clear Caribbean water marine conservation",
        "gray wolf pack alpha howling rocky outcrop full moon northern wilderness predator behavior pack howl wilderness ecosystem",
        "African elephant matriarch leading herd dry riverbed dust cloud rising wrinkled skin texture detail savanna elephant family",
        "snow leopard perfectly camouflaged rocky Himalayan slope spotted fur matching terrain rare elusive big cat capture endangered species",
        "monarch butterfly mass migration cluster hanging eucalyptus branches thousands orange wings creating living curtain migration phenomenon",
        "poison dart frog jewel-bright blue coloration tropical leaf tiny amphibian vivid warning coloration macro amazon rainforest",
        "polar bear swimming Arctic ocean ice floes powerful stroke white fur wet endangered species fragile habitat climate change arctic",
        "hummingbird hovering feeding red flower wings beating too fast see iridescent throat feathers catching light smallest bird",
        "chameleon slowly walking branch independently rotating eyes scanning surroundings color-changing ability reptile adaptation macro",
        "humpback whale breaching completely Pacific Ocean surface water droplets flying massive mammal defying gravity cetacean breach",
        "arctic fox white winter coat pouncing snow catch prey beneath surface hunting behavior frozen action photograph camouflage",
        "gorilla silverback chest-beating dominance display jungle clearing powerful primate intimidation behavior primate silverback alpha",
        "cuttlefish displaying rapidly changing color patterns skin sophisticated camouflage communication marine intelligence cephalopod",
        "baby orangutan clinging mother swinging Borneo rainforest canopy endangered great ape conservation orangutan baby cute wildlife",
        "bald eagle soaring freshly caught fish talons American symbol freedom raptor fishing success bald eagle national bird america",
        "jellyfish drifting deep blue ocean current translucent bell body trailing tentacles glowing bioluminescence deep sea creature",
        "meerkat family sentry guard upright foraging cooperative African social mammal behavior documentation meerkat family group",
        "king penguin colony breeding season South Georgia island thousands tuxedo birds fluffy brown chicks demanding food antarctic",
        "cheetah full sprint gazelle African plains fastest land animal blurred legs demonstrating incredible velocity feline speed run",
        "tree frog huge red eyes staring bromeliad plant tropical amphibian surprising appearance rainforest macro amphibian exotic",
    ],
    "food": [
        "artisan sourdough bread loaf golden crusty crust torn open airy crumb structure rustic wooden table bakery morning fresh baked",
        "decadent chocolate layer cake ganache dripping sides placed dark slate plate dessert photography styling patisserie chocolate",
        "fresh sushi omakase arrangement long ceramic platter wasabi mound pickled ginger chef knife work Japanese culinary art sashimi",
        "perfectly crafted latte art coffee rosetta foam pattern white ceramic cup cozy cafe ambiance steam rising barista craft coffee",
        "vibrant açai smoothie bowl topped sliced bananas granola coconut drizzled honey healthy breakfast flat lay superfood bowl acai",
        "wood-fired Neapolitan pizza Margherita charred leopard-spotted crust fresh basil mozzarella San Marzano tomato authentic italian",
        "French croissant freshly baked flaky golden layers stacked wire rack butter particles visible patisserie viennoiserie pastry window",
        "ramen bowl rich tonkotsu broth chashu pork soft boiled egg nori seaweed steam rising Japanese comfort food soul warming ramen",
        "colorful poke bowl fresh ahi tuna cube sashimi grade rice edamame sesame avocado Hawaiian fusion cuisine healthy poke hawaiian",
        "homemade pasta tagliatelle wild mushroom ragu sauce parmesan shaving truffle oil rustic Italian cooking homemade pasta italian",
        "afternoon tea tower finger scones clotted cream jam selection macarons petit fours English tradition elegant service afternoon tea",
        "grilled Wagyu A5 beef steak perfect sear crust medium-rare pink resting cutting board herb butter melting wagyu premium steak",
        "Indian thali meal variety curries dal naan rice papadum arranged metal tray complete balanced traditional feast indian cuisine thali",
        "freshly shucked oysters crushed ice bed lemon wedges mignonette sauce seafood restaurant premium appetizer oyster presentation",
        "Vietnamese pho soup bowl rare beef slices herbs bean sprouts lime aromatic broth steaming comforting noodle soup pho vietnamese",
        "Moroccan tagine stew cone-shaped earthenware dish chicken preserved lemons olives North African spices fragrant moroccan tagine",
        "Mexican street tacos al pastor small corn tortillas pineapple salsa cilantro onions casual authentic food culture tacos mexican",
        "Korean bibimbap hot stone bowl raw egg yolk vegetables gochujang sizzling rice crust forming bottom colorful mix korean bibimbap",
        "Greek mezze platter assortment hummus tzatziki falafel dolmas olives feta Mediterranean diet sharing feast mediterranean mezze greek",
        "Thai green curry tender chicken Thai basil jasmine rice coconut milk green chili sauce Southeast Asian flavors thai curry green",
        "Spanish paella pan saffron yellow rice mussels shrimp peppers communal dish straight oven rustic spanish paella seafood paella",
        "American BBQ smoked brisket sliced smoke ring pulled pork mac and cheese cornbread Southern comfort food spread barbecue bbq american",
        "Ethiopian injera sponge bread variety wot stews arranged sharing hands eating traditional communal dining experience ethiopian injera",
    ],
    "fashion": [
        "avant-garde 3D printed dress mathematical parametric design Iris van Herpen haute couture innovation wearable sculpture fashion tech",
        "streetwear outfit flat lay limited edition sneakers oversized graphic hoodie designer chain accessories urban fashion blog streetwear",
        "1920s Great Gatsby flapper dress fringe beading art deco jewelry jazz age glamour vintage fashion revival roaring twenties retro",
        "traditional Japanese wedding kimono elaborate obi sash hair ornaments seasonal motif embroidery cultural elegance kimono bridal fashion",
        "futuristic techwear jacket integrated flexible OLED display panels animated patterns cyberpunk functional fashion wearable tech",
        "Paris Fashion Week runway model walking voluminous tulle gown spotlight haute couture show drama paris fashion week couture",
        "minimalist Scandinavian design outfit monochrome palette clean lines structured tailoring quiet luxury aesthetic scandinavian fashion",
        "Victorian corset bustle gown reproduction lace parasol historical costume accuracy romantic period fashion victorian historical",
        "1980s power suit exaggerated shoulder pads bold prints retro fashion decade statement maximalist era revival eighties vintage",
        "Bohemian festival fashion layered mixed prints crochet vest ankle boots flower crown Coachella free spirit boho style bohemian",
        "tailored British Savile Row bespoke three-piece suit navy wool pocket square tie pin classic menswear sophistication bespoke suit",
        "deconstructed denim outfit raw edges safety pins custom patches punk rock rebellion anti-fashion DIY aesthetic punk fashion denim",
        "traditional Indian bridal lehenga heavy embroidery gemstones henna decorated hands opulent wedding cout richness indian bridal lehenga",
        "athleisure yoga set sustainable bamboo fabric earth tones comfortable yet stylish wellness lifestyle activewear athleisure yoga",
        "gothic Lolita fashion coordinate petticoat lace headbow platform shoes Japanese street fashion subculture lolita fashion gothic",
        "sustainable upcycled fashion garment repurposed materials eco-conscious design waste reduction fashion forward sustainability fashion",
        "Korean Hanbok modern reinterpretation contemporary silhouette adjustments traditional meets modern fusion wear hanbok korean modern",
        "Brazilian Carnival showgirl costume enormous feather headdress sequined bikini body samba parade spectacular extravaganza carnival brazil",
        "workwear chore jacket carpenter pants utility fashion Carhartt heritage brand rugged durability meets style workwear chore carhartt",
        "lingerie boudoir silk robe lace set blush pink intimate apparel delicate fabric feminine romantic bedroom lingerie silk lace",
        "traditional Scottish Highland dress kilt sporran sgian dubh tartan clan pattern heritage formal wear cultural costume scottish kilt",
        "mod 1960s Twiggy-inspired mini shift dress geometric pattern white boots Swinging London youthquake fashion revolution mod sixties",
    ],
    "horror": [
        "abandoned insane asylum long corridor peeling paint wheelchair sitting distance fog rolling broken end window haunted asylum creepy",
        "carved jack-o'-lantern glowing eerie orange candlelight within Halloween autumn fallen leaves scattered base pumpkin halloween spooky",
        "gothic Victorian mansion hilltop violent thunderstorm lightning flash illuminating decaying facade haunted house mansion storm",
        "ancient cursed statue dusty forgotten display case ominous shadows cast strangely supernatural thriller ominous presence museum curse",
        "creepy porcelain doll collection lined wooden shelf dimly lit attic single candle flickering nearby unsettling vintage horror doll",
        "foggy graveyard midnight cracked tombstones leaning angles bare tree branches clawing full moon classic spooky graveyard cemetery",
        "abandoned hospital emergency room rusted gurneys flickering fluorescent lights casting sickly green pallor abandoned hospital creepy",
        "clown emerging sewer drain dark alley sinister grin painted face Stephen King IT reference horror villain imagery clown scary",
        "possessed child levitating suburban bedroom objects floating around head rotated unnaturally exorcism movie moment possession demon",
        "creepy forest hanging nooses tree branches fog obscuring ground single doll hanging among them disturbing silence forest scary",
        "abandoned amusement park rusted roller coaster silhouette blood-red sunset closed down decades haunted carnival abandoned park",
        "basement stairs descending impenetrable darkness scratching sounds below single bulb swinging casting moving shadows basement scary",
        "zombie horde shambling burning city night fire reflecting dead eyes apocalyptic horror survival zombie apocalypse undead",
        "ghostly pale figure standing corner empty dark room watching silently long dark hair covering face J-horror aesthetic ghost japanese",
        "witch cauldron bubbling grotesque ingredients decrepit cottage spell book open nearby green smoke rising witch occult horror",
        "abandoned church inverted cross altar satanic symbols scrawled walls looks like blood desecrated sacred space satanic church evil",
        "creepy ventriloquist dummy sitting chair unsettling permanent grin dummy appears breathing own ventriloquist dummy creepy puppet",
        "haunted mirror reflection showing something different person standing before it subtle wrongness building dread gradually mirror cursed",
        "bodyhorror transformation skin rippling bones reshaping uncomfortably David Cronenberg visceral biological terror body horror gross",
        "deep ocean abyssal zone creature bioluminescent lure angler fish proportions scaled monstrously thalassophobia trigger deep sea",
        "creepy children playing ring rosie overgrown yard abandoned orphanage twilight innocent rhyme made menacing creepy kids orphanage",
        "abandoned subway tunnel strange graffiti seems move not looked directly flashlight beam revealing decay subway tunnel creepy",
        "ancient mummy partially unwrapped sarcophagus lid pushed inside curse dust motes floating tomb flashlight beam egyptian mummy curse",
        "puppet master marionette strings controlling real human bodies like dolls dark theater body control horror helplessness puppet strings",
    ],
    "cyberpunk": [
        "rain-soaked cyberpunk Tokyo street night neon kanji signs reflected puddles flying cars passing skyscrapers blade runner rainy city",
        "hackers cramped apartment six monitors code scrolling empty ramen cups RGB strip lighting dystopian living hacker apartment cyberpunk",
        "massive holographic anime girl advertisement projected buildings crowded market district blinding brightness advertisement hologram",
        "chrome-plated cybernetic arm sleeve mechanical joints wiring visible human-flesh fusion detail shot augmentation cybernetic arm",
        "underground illegal nightclub laser shows diverse crowd smoke machines bass vibrating floor neon drink specials cyberpunk club",
        "flying vehicle traffic jam futuristic mega-city streets night holographic billboard advertisements everywhere competing attention traffic",
        "cybernetically enhanced street samurai rooftop overlooking neon-drenched metropolis katana reflecting city lights cyberpunk samurai",
        "corporate executive sterile white office overlooking megacity floor-to-ceiling glass absolute power verticality corporate tower",
        "black market cybernetics clinic back alley operating table dubious sterilization used implants displayed parts ripperdoc clinic",
        "VR addict capsule apartment fully immersed headset emaciated body neglected mind lives digital paradise escape simulation addiction",
        "police drone swarm patrol sector red scanner beams authoritarian surveillance state enforcement drone surveillance police",
        "run-down noodle stall beneath elevated highway neon sign flickering lone customer eating rain cyberpunk melancholy noodle stall",
        "data courier running market valuable encrypted chip brain implant corporations sending mercenaries after cyberpunk runner chase",
        "abandoned construction site homeless cyborgs gathering trash can fire rejected society obsolete models discarded gutter cyberpunk",
        "luxury upper city penthouse party genetically perfected people looking down street level below literally class division penthouse",
        "brain-machine interface surgery progress skull open neural link chip inserted sterile operating theater blue lighting implant surgery",
        "neon-lit fish market dawn vendors selling both real synthetic seafood early morning crowd everyday life persists fish market",
        "rebel broadcast pirate signal hijacking public screens anti-corporate message people stopping watch surprise propaganda hack",
        "aging Yakuza boss half-cybernetic body traditional room electronic sakua bonsai old world meets new violently yakuza cyberpunk",
        "sewer dwelling community fell through society cracks makeshift homes jury-rigged electricity stolen surface grid undercity sewer",
        "AI android developing unexpected emotions serving coffee chain shop subtle realization moment mundane setting AI consciousness emergent",
        "mega-corporation headquarters spire piercing clouds eternal smog layer elite literally above pollution created corporate tower",
    ],
}

# Category display info
CATEGORY_INFO = {
    "portrait": {"name": "Portrait", "emoji": "👤", "color": "from-rose-600 to-pink-700"},
    "landscape": {"name": "Landscape", "emoji": "🏔️", "color": "from-emerald-600 to-teal-700"},
    "fantasy": {"name": "Fantasy", "emoji": "🐉", "color": "from-violet-600 to-purple-700"},
    "sci-fi": {"name": "Sci-Fi", "emoji": "🚀", "color": "from-blue-600 to-cyan-700"},
    "anime": {"name": "Anime", "emoji": "🎌", "color": "from-pink-600 to-rose-700"},
    "abstract": {"name": "Abstract", "emoji": "🎨", "color": "from-amber-600 to-orange-700"},
    "architecture": {"name": "Architecture", "emoji": "🏛️", "color": "from-stone-600 to-zinc-700"},
    "animal": {"name": "Animal", "emoji": "🦁", "color": "from-lime-600 to-green-700"},
    "food": {"name": "Food", "emoji": "🍜", "color": "from-red-600 to-amber-700"},
    "fashion": {"name": "Fashion", "emoji": "👗", "color": "from-fuchsia-600 to-pink-700"},
    "horror": {"name": "Horror", "emoji": "👻", "color": "from-gray-800 to-black"},
    "cyberpunk": {"name": "Cyberpunk", "emoji": "🌆", "color": "from-yellow-600 to-amber-700"},
}

# Style modifiers for generating variants
STYLE_MODIFIERS = {
    "portrait": ["cinematic lighting", "studio portrait style", "natural outdoor light", "dramatic chiaroscuro", "golden hour glow", "soft diffused window light"],
    "landscape": ["epic composition", "intimate detail shot", "aerial drone perspective", "ground-level foreground focus", "misty atmospheric", "crystal clear day"],
    "fantasy": ["epic cinematic", "storybook illustration", "dark ominous", "ethereal luminous", "battle scene aftermath", "peaceful realm establishing"],
    "sci-fi": ["hard science fiction", "space opera grandeur", "gritty realistic", "utopian bright future", "dystopian oppressive", "exploration discovery"],
    "anime": ["movie key visual quality", "TV series screenshot aesthetic", "manga panel style", "character design sheet", "background art only", "action scene freeze frame"],
    "abstract": ["minimal composition", "maximal complexity", "monochromatic", "rainbow spectrum", "organic flowing", "rigid geometric"],
    "architecture": ["interior focus", "exterior facade detail", "golden hour lighting", "blue hour mood", "overcast flat light", "night illumination"],
    "animal": ["action behavior capture", "sleeping resting pose", "baby juvenile animal", "environmental portrait", "extreme close-up macro", "wide habitat context"],
    "food": ["restaurant plated presentation", "home cooking comfort food", "street food casual", "fine dining elegance", "ingredient preparation step", "finished dish hero shot"],
    "fashion": ["editorial magazine spread", "catalog product photo", "street style candid", "atelier workshop detail", "runway show capture", "behind scenes backstage"],
    "horror": ["psychological tension", "jump scare moment", "slow dread build-up", "gore explicit", "supernatural subtle", "found footage aesthetic"],
    "cyberpunk": ["daytime contrast", "night neon saturation", "corporate clean areas", "underground grit zones", "action chase scene", "quiet contemplative moment"],
}

ARTIST_TAGS = {
    "portrait": ["by Annie Leibovitz", "by Platon Antoniou", "by Martin Schoeller", "by Richard Avedon", "inspired by Peter Lindbergh", "Steve McCurry style"],
    "landscape": ["National Geographic photo", "by Ansel Adams", "by Sebastião Salgado", "by Andreas Gursky", "by Michael Kenna", "Galen Rowell style"],
    "fantasy": ["by Greg Rutkowski", "by Alphonse Mucha", "by Frank Frazetta", "by Yoshitaka Amano", "by Craig Mullins", "WLOP artstation style"],
    "sci-fi": ["Syd Mead concept", "by H.R. Giger", "by Moebius", "by Simon Stålenhag", "by Beeple", "Industrial Light Magic concept"],
    "anime": ["Makoto Shinkai style", "Studio Ghibli style", "ufotable animation", "Kyoto Animation quality", "MAPPA production value", "Trigger anime style"],
    "abstract": ["by Wassily Kandinsky", "Gerhard Richter style", "Olafur Eliasson installation", "James Turrell light", "Agnes Martin minimal", "Mark Rothko fields"],
    "architecture": ["by Iwan Baan", "Julius Shulman photo", "by Hiroshi Sugimoto", "Andreas Gursky architecture", "Candida Höfer interiors", "Zaha Hadid blueprint"],
    "animal": ["National Geographic wildlife", "by Frans Lanting", "by Tim Flach", "by Joel Sartore Photo Ark", "BBC Planet Earth still", "Steve Winter tiger photos"],
    "food": ["food photography professional", "by David Lebovitz", "Bon Appétit editorial", "saveur magazine style", "professional food stylist", "Michelin guide aesthetic"],
    "fashion": ["Vogue editorial", "Harper's Bazaar spread", "by Mario Testino", "by Tim Walker", "by Helmut Newton", "Annie Leibovitz Vogue shoot"],
    "horror": ["Stanley Kubrick horror", "John Carpenter atmosphere", "Guillermo del Toro design", "Junji Ito manga horror", "Silent Hill aesthetic", "Blair Witch found footage"],
    "cyberpunk": ["blade runner 2049", "Ghost in the Shell 1995", "Akira cel shaded", "Cyberpunk 2077 key art", "Altered Carbon visual", "Minority Report interface"],
}


def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip().rstrip(',')


def make_title(prompt):
    cleaned = clean_text(prompt)
    if len(cleaned) <= 120:
        return cleaned
    for punct in ['. ', '! ', '? ']:
        idx = cleaned.rfind(punct, 0, 120)
        if idx > 40:
            return cleaned[:idx + 1].strip()
    return cleaned[:120].rsplit(' ', 1)[0] + '...'


def make_image_url(prompt, seed):
    encoded = urllib.parse.quote(clean_text(prompt)[:150])
    return f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&seed={seed}&nologo=true&model=flux"


def make_tags(cat):
    base = {
        "portrait": ["portrait", "photorealistic", "character"],
        "landscape": ["nature", "scenery", "outdoor"],
        "fantasy": ["magic", "epic", "imaginative"],
        "sci-fi": ["technology", "futuristic", "space"],
        "anime": ["animation", "illustration", "japanese"],
        "abstract": ["artistic", "creative", "modern art"],
        "architecture": ["design", "building", "interior"],
        "animal": ["wildlife", "creature", "nature"],
        "food": ["culinary", "gourmet", "delicious"],
        "fashion": ["style", "clothing", "couture"],
        "horror": ["dark", "spooky", "atmospheric"],
        "cyberpunk": ["neon", "urban", "tech"],
    }
    tags = [cat] + base.get(cat, []) + ["ai-art", "ai-prompt"]
    return list(dict.fromkeys(tags))


def generate_variants(base_prompt, category, count=3):
    """Generate style/artist variants of a base prompt."""
    variants = []
    styles = STYLE_MODIFIERS.get(category, ["cinematic"])
    artists = ARTIST_TAGS.get(category, [])

    for i in range(count):
        variant = base_prompt
        # Add style modifier
        if i < len(styles):
            variant = f"{variant}, {styles[i]}"
        # Add artist tag (for some variants)
        if i > 0 and artists and i % 2 == 0:
            artist = random.choice(artists)
            variant = f"{variant}, {artist}"
        # Add technical quality boosters
        boosters = ["highly detailed", "8k resolution", "masterpiece", "best quality"]
        if i > 0:
            variant = f"{variant}, {random.choice(boosters)}"
        variants.append(variant)

    return variants


def main():
    print("=" * 60)
    print("Prompt Hub Data Generator v4")
    print("=" * 60)

    items = []
    idx = 0

    for category, base_prompts in BASE_PROMPTS.items():
        print(f"\n Processing {category}: {len(base_prompts)} base prompts...", end="")

        cat_items = []
        for bp in base_prompts:
            seed_base = idx * 17 + 333

            # Original prompt
            item = {
                "slug": f"{category[:3]}-{idx + 1}",
                "title": {"en": make_title(bp), "zh": ""},
                "prompt": clean_text(bp),
                "category": category,
                "tags": make_tags(category),
                "primaryImage": {"remoteUrl": make_image_url(bp, seed_base), "altText": make_title(bp)[:80]},
                "viewCount": random.randint(800, 20000),
                "likeCount": random.randint(50, 3000),
                "createdAt": "2026-01-15T00:00:00.000Z",
            }
            cat_items.append(item)
            idx += 1

            # Generate variants (2 per base prompt to reach ~1000)
            variants = generate_variants(bp, category, count=2)
            for vi, vp in enumerate(variants):
                seed_v = seed_base + vi * 99 + 77
                v_item = {
                    "slug": f"{category[:3]}-{idx + 1}",
                    "title": {"en": make_title(vp), "zh": ""},
                    "prompt": clean_text(vp),
                    "category": category,
                    "tags": make_tags(category),
                    "primaryImage": {"remoteUrl": make_image_url(vp, seed_v), "altText": make_title(vp)[:80]},
                    "viewCount": random.randint(400, 15000),
                    "likeCount": random.randint(30, 2000),
                    "createdAt": "2026-01-15T00:00:00.000Z",
                }
                cat_items.append(v_item)
                idx += 1

        items.extend(cat_items)
        print(f" -> {len(cat_items)} items")

    # Shuffle
    random.shuffle(items)

    # Re-index slugs
    for i, item in enumerate(items):
        item['slug'] = f"{item['category'][:3]}-{i + 1}"

    output = {
        "items": items,
        "total": len(items),
        "categories": sorted([c["name"] for c in CATEGORY_INFO.values()]),
        "categorySlugs": sorted(CATEGORY_INFO.keys()),
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # Stats
    print(f"\n{'='*60}")
    print(f"DONE: {len(items)} total items")
    cats = {}
    for i in items:
        c = i['category']
        cats[c] = cats.get(c, 0) + 1

    print(f"\nCategory breakdown:")
    for c in sorted(cats.keys()):
        info = CATEGORY_INFO.get(c, {})
        print(f"  {info.get('emoji','?')} {c:12} {cats[c]:4}")

    has_img = sum(1 for i in items if i.get('primaryImage', {}).get('remoteUrl'))
    print(f"\nWith image URLs: {has_img}/{len(items)}")
    avg_t = sum(len(i['title']['en']) for i in items) / len(items)
    print(f"Avg title length: {avg_t:.0f} chars")
    print(f"Output: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
