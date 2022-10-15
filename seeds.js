const mongoose = require('mongoose');
const Details = require('./models/car-details');

mongoose.connect('mongodb://localhost:27017/cHarLs')
    .then(() => {
        console.log("Connection Open");
    })
    .catch(err => {
        console.log("Error");
        console.log(err);
    })

//Please manually create a new user with username related to Uploader of car listed below to bcrypt the password. Thanks.

const carList = [
    {
        FileName: "toyota-vios.jpg",
        UploadBy: "username1",
        ListName: 'Toyota Vios',
        Address: 'Pasig City',
        Description: "The Philippines' best-selling got upgraded: a finessed exterior design that's swift on the street, with the same reliable grip and steering that you can trust.",
        Type: 'Sedan',
        Brand: 'Toyota',
        Color: 'Red',
    },
    {
        FileName: "mercedes-eqb.jpg",
        UploadBy: "username2",
        ListName: 'EQB 300 4MATIC SUV',
        Address: 'Caloocan City',
        Description: "Compact outside, the all-electric, all-wheel-drive EQB 300 4MATIC SUV is big on space, style and smart ideas. With available seating for seven, a digital voice assistant and MB Navigation with Electric Intelligence, the EQB is born from a forward-thinking family, and built for yours.",
        Type: 'SUV',
        Brand: 'Mercedes',
        Color: 'White',
    },
    {
        FileName: "2021-honda-city-hatchback.jpg",
        UploadBy: "username3",
        ListName: '2021 Honda City Hatchback',
        Address: 'Mandaluyong City',
        Description: "Loaded with energy, overflowing with potential, the City Hatchback RS was built for more. More style, more adventure, more life, more you and everything you want to move. Every angle is an impressive view with the stylish new City front end blended beautifully into 5-doors of pure fun.",
        Type: 'Hatchback',
        Brand: 'Honda',
        Color: 'Black',
    },
    {
        FileName: "2022-hyundai-santa-cruz.jpg",
        UploadBy: "username4",
        ListName: 'Hyundai Santa Cruz 2022',
        Address: 'Malabon City',
        Description: "This next-generation Hyundai pick-up vehicle appears to be extremely enticing at first sight. The Hyundai 2022 Santa Cruz is a hybrid of the compact crossover Hyundai Tucson and the bigger SUV Hyundai Outback.",
        Type: 'Pickup',
        Brand: 'Hyundai',
        Color: 'Black',
    },
    {
        FileName: "bmw-i8.jpg",
        UploadBy: "username1",
        ListName: 'BMW i8',
        Address: 'Manila City',
        Description: "The first BMW plug-in hybrid combined the best of both worlds: it brings together sheer driving pleasure and excellent driving performance – the two factors that make up the essence of a sports car – with the resource-efficient and environmentally friendly technology of an electric propulsion system. The thing is, there isn’t just one BMW i8 engine – the BMW sports car’s drive unit consists of both a combustion engine and an electric engine ",
        Type: 'Sport Car',
        Brand: 'BMW',
        Color: 'Blue',
    },
    {
        FileName: "2022-honda-nsx.jpg",
        UploadBy: "username2",
        ListName: '2022 Honda NSX Type S',
        Address: 'Las Pinas City',
        Description: "This is the Honda NSX Type S – a send-off for the hybrid sports car that’ll be limited to just 350 cars worldwide. It’s the return of a nameplate last used on a special edition NSX in 1997 and sees the new car’s power boosted to 600hp, along with some chassis upgrades.",
        Type: 'Sport Car',
        Brand: 'Honda',
        Color: 'Orange',
    },
    {
        FileName: "toyota-sequoia.jpg",
        UploadBy: "username1",
        ListName: 'Toyota Sequoia',
        Address: 'Cavite',
        Description: "This Toyota SUV takes command on the road and on the trail.* With available seating for up to 8, adaptive suspension, and towing capacity of up to 7,400 lbs.,* this SUV has what you need to bring your passengers and their gear on a full-size adventure.",
        Type: 'SUV',
        Brand: 'Toyota',
        Color: 'White',
    },
    {
        FileName: "2022-tesla-model-s.jpg",
        UploadBy: "username3",
        ListName: '2022 Tesla Model S',
        Address: 'Laguna',
        Description: "Dual Motor All-Wheel Drive unlocks more range than any other vehicle in our current lineup, with insane power and maximum control. Air vents are hidden throughout the cabin, while tri-zone temperature controls, ventilated seats and HEPA filtration deliver the perfect environment.",
        Type: 'Sedan',
        Brand: 'Tesla',
        Color: 'Red',
    },
    {
        FileName: "2016-hyundai-veloster.jpg",
        UploadBy: "username1",
        ListName: '2016 Hyundai Veloster',
        Address: 'Laguna',
        Description: "The 2016 Veloster comes in four trims: base, Turbo, R-Spec, and Rally Edition. The Hyundai Veloster base trim has a 7-inch touch screen, a rearview camera, Bluetooth, a USB port, a CD player, keyless entry, cruise control, air conditioning, cloth upholstery, and alloy wheels.",
        Type: 'Hatchback',
        Brand: 'Hyundai',
        Color: 'Blue',
    },
   
]

Details.insertMany(carList)
    .then(res => {
        console.log(res);
    })
    .catch(e => {
        console.log(e);
    })