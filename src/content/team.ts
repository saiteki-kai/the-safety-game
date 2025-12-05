import daniel from "@assets/team/daniel_scalena.jpg";
import elisabetta from "@assets/team/elisabetta_fersini.png";
import giulia from "@assets/team/giulia_rizzi.jpg";
import giuseppe from "@assets/team/giuseppe_magazzù.jpeg";
import type { ImageMetadata } from "astro";

export interface Member {
  name: string;
  email: string;
  image?: ImageMetadata;
}

export const TEAM_MEMBERS: Member[] = [
  {
    name: "Elisabetta Fersini",
    email: "elisabetta.fersini@unimib.it",
    image: elisabetta,
  },
  {
    name: "Giulia Rizzi",
    email: "g.rizzi10@campus.unimib.it",
    image: giulia,
  },
  {
    name: "Giuseppe Magazzù",
    email: "g.magazzu1@campus.unimib.it",
    image: giuseppe,
  },
  {
    name: "Daniel Scalena",
    email: "d.scalena@campus.unimib.it",
    image: daniel,
  },
  {
    name: "Alberto Sormani",
    email: "a.sormani7@campus.unimib.it",
    image: null,
  },
  {
    name: "Andrea Muscio",
    email: "a.muscio@campus.unimib.it",
    image: null,
  },
];

export default TEAM_MEMBERS;
