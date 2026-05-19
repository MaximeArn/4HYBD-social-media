import type { Conversation } from "../types/entities";
import { hoursAgo, daysAgo } from "../utils";

export const conversations: Conversation[] = [
  {
    id: "c1",
    participants: ["u1", "u2"],
    messages: [
      { id: "m1", senderId: "u2", content: "Salut Marie ! Comment tu vas ?", type: "text", timestamp: daysAgo(2, 10) },
      { id: "m2", senderId: "u1", content: "Super bien merci ! Et toi Thomas ?", type: "text", timestamp: daysAgo(2, 11) },
      { id: "m3", senderId: "u2", content: "Nickel ! Tu fais quoi ce weekend ?", type: "text", timestamp: daysAgo(2, 14) },
      { id: "m4", senderId: "u1", content: "Je sais pas encore, peut-etre sortir a Paris", type: "text", timestamp: daysAgo(1, 9) },
      { id: "m5", senderId: "u2", content: "Trop bien ! J'ai vu ta story de la Tour Eiffel btw", type: "text", timestamp: daysAgo(1, 10) },
      { id: "m6", senderId: "u1", content: "Oui c'etait magique", type: "text", timestamp: hoursAgo(3) },
    ],
  },
  {
    id: "c2",
    participants: ["u1", "u3"],
    messages: [
      { id: "m10", senderId: "u3", content: "Hey ! J'ai vu ta story de la Tour Eiffel", type: "text", timestamp: hoursAgo(10) },
      { id: "m11", senderId: "u1", content: "Oui c'etait trop beau ce soir", type: "text", timestamp: hoursAgo(9) },
      { id: "m12", senderId: "u3", content: "J'adorerais venir a Paris bientot !", type: "text", timestamp: hoursAgo(8) },
      { id: "m13", senderId: "u1", content: "Viens quand tu veux, je te ferai visiter", type: "text", timestamp: hoursAgo(7) },
      { id: "m14", senderId: "u3", content: "C'est note ! Peut-etre le mois prochain ?", type: "text", timestamp: hoursAgo(5) },
      { id: "m15", senderId: "u1", content: "Parfait ! Je reserve un resto sympa", type: "text", timestamp: hoursAgo(2) },
    ],
  },
  {
    id: "c3",
    participants: ["u2", "u3"],
    messages: [
      { id: "m20", senderId: "u2", content: "Sophie ! On se voit bientot ?", type: "text", timestamp: daysAgo(3, 15) },
      { id: "m21", senderId: "u3", content: "Oui avec plaisir ! Tu passes par Marseille ?", type: "text", timestamp: daysAgo(3, 16) },
      { id: "m22", senderId: "u2", content: "Pas prevu mais pourquoi pas cet ete", type: "text", timestamp: daysAgo(3, 17) },
      { id: "m23", senderId: "u3", content: "Ce serait top ! Les calanques sont magnifiques en juillet", type: "text", timestamp: daysAgo(2, 11) },
      { id: "m24", senderId: "u2", content: "Je mets ca dans mon agenda", type: "text", timestamp: hoursAgo(6) },
    ],
  },
  {
    id: "c4",
    participants: ["u1", "u4"],
    messages: [
      { id: "m30", senderId: "u4", content: "Marie ! T'as essaye le nouveau bar a vins a Paris ?", type: "text", timestamp: daysAgo(1, 19) },
      { id: "m31", senderId: "u1", content: "Non pas encore, il est comment ?", type: "text", timestamp: daysAgo(1, 20) },
      { id: "m32", senderId: "u4", content: "Super selection de Bordeaux, tu vas adorer", type: "text", timestamp: daysAgo(1, 21) },
      { id: "m33", senderId: "u1", content: "On y va ensemble quand tu montes a Paris ?", type: "text", timestamp: hoursAgo(4) },
      { id: "m34", senderId: "u4", content: "Deal ! Je viens la semaine prochaine", type: "text", timestamp: hoursAgo(1) },
    ],
  },
  {
    id: "c5",
    participants: ["u3", "u5"],
    messages: [
      { id: "m40", senderId: "u5", content: "Sophie ! Ton expo de photos elle est toujours d'actu ?", type: "text", timestamp: daysAgo(4, 14) },
      { id: "m41", senderId: "u3", content: "Oui ! Jusqu'a fin juin a la galerie du Vieux-Port", type: "text", timestamp: daysAgo(4, 15) },
      { id: "m42", senderId: "u5", content: "Trop bien, je prevois de descendre sur Marseille !", type: "text", timestamp: daysAgo(4, 16) },
      { id: "m43", senderId: "u3", content: "Je t'attendrai avec une bouillabaisse", type: "text", timestamp: daysAgo(3, 10) },
      { id: "m44", senderId: "u5", content: "Haha motus ! Je reserve mon train", type: "text", timestamp: daysAgo(2, 18) },
      { id: "m45", senderId: "u3", content: "C'est valide ! Previens-moi la date exacte", type: "text", timestamp: hoursAgo(12) },
    ],
  },
  {
    id: "c6",
    participants: ["u6", "u7"],
    messages: [
      { id: "m50", senderId: "u6", content: "Camille ! Ton groupe de rando il est complet ?", type: "text", timestamp: daysAgo(1, 8) },
      { id: "m51", senderId: "u7", content: "Il reste une place ! Tu veux rejoindre ?", type: "text", timestamp: daysAgo(1, 9) },
      { id: "m52", senderId: "u6", content: "Carrement ! C'est quand et ou ?", type: "text", timestamp: daysAgo(1, 10) },
      { id: "m53", senderId: "u7", content: "Samedi matin en foret de Broceliande", type: "text", timestamp: daysAgo(1, 11) },
      { id: "m54", senderId: "u6", content: "Je viens depuis Lille, c'est quand meme loin", type: "text", timestamp: hoursAgo(8) },
      { id: "m55", senderId: "u7", content: "Ca vaut le deplacement promis !", type: "text", timestamp: hoursAgo(5) },
      { id: "m56", senderId: "u6", content: "OK j'arrive vendredi soir alors", type: "text", timestamp: hoursAgo(2) },
    ],
  },
];
