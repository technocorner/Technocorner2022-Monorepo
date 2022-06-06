import { firestore } from "firebase-admin";
import { server } from "../../../data/server";
import firebase from "../../firebase";

export default async function registerUser({
  nama,
  email,
  googleId,
  foto,
  sandi,
}: {
  nama: string;
  email: string;
  googleId: string;
  foto?: string;
  sandi: string;
}) {
  const data = {
    nama,
    email,
    googleId,
    sandi: sandi ? sandi : null,
    foto: foto ? foto : `${server}/avatar/${randomPhoto()}.png`,
    status: null,
    instansi: null,
    identitas: null,
    whatsapp: null,
    acara: [],
    bekukan: false,
    verifikasi: false,
    peran: process.env.NODE_ENV === "development" ? "admin" : "pengguna",
    createTime: firestore.FieldValue.serverTimestamp(),
  };

  await firebase.firestore().collection("pendaftar").doc(email).delete();
  await firebase.firestore().collection("pengguna").doc(email).create(data);

  return { success: true, body: data };
}

function randomPhoto() {
  const photos = [
    "Alligator",
    "Chipmunk",
    "Gopher",
    "Liger",
    "Quagga",
    "Anteater",
    "Chupacabra",
    "Grizzly",
    "Llama",
    "Rabbit",
    "Armadillo",
    "Cormorant",
    "Hedgehog",
    "Manatee",
    "Raccoon",
    "Auroch",
    "Coyote",
    "Hippo",
    "Mink",
    "Rhino",
    "Axolotl",
    "Crow",
    "Hyena",
    "Monkey",
    "Sheep",
    "Badger",
    "Dingo",
    "Ibex",
    "Moose",
    "Shrew",
    "Bat",
    "Dinosaur",
    "Ifrit",
    "Narwhal",
    "Skunk",
    "Beaver",
    "Dolphin",
    "Iguana",
    "Orangutan",
    "Squirrel",
    "Buffalo",
    "Duck",
    "Jackal",
    "Otter",
    "Tiger",
    "Camel",
    "Elephant",
    "Kangaroo",
    "Panda",
    "Turtle",
    "Capybara",
    "Ferret",
    "Koala",
    "Penguin",
    "Walrus",
    "Chameleon",
    "Fox",
    "Kraken",
    "Platypus",
    "Wolf",
    "Cheetah",
    "Frog",
    "Lemur",
    "Pumpkin",
    "Wolverine",
    "Chinchilla",
    "Giraffe",
    "Leopard",
    "Python",
    "Wombat",
  ];

  return photos[Math.floor(Math.random() * photos.length)];
}
