import { register } from "timeago.js";
import LocalStorage from "../utils/LocalStorage";

export enum LANGUAGES {
  "en" = "English",
  "hr" = "Hrvatski",
}

export type Language = keyof typeof LANGUAGES;

export type Keys =
  | "new"
  | "confirm"
  | "edit"
  | "save"
  | "username"
  | "password"
  | "repeatPassword"
  | "email"
  | "login"
  | "register"
  | "newPostPlaceholder"
  | "privatePost"
  | "submit"
  | "firstName"
  | "lastName"
  | "backToLogin"
  | "replyPlaceholder"
  | "userSearchPlaceholder"
  | "search"
  | "add"
  | "addFriend"
  | "accept"
  | "acceptRequest"
  | "decline"
  | "declineRequest"
  | "cancel"
  | "cancelRequest"
  | "remove"
  | "removeFriend"
  | "message"
  | "messenger"
  | "friends"
  | "friendRequests"
  | "profile"
  | "logout"
  | "pageNotFound"
  | "return"
  | "newPost"
  | "newMessage"
  | "newFriendRequest"
  | "from"
  | "delete"
  | "likesSingular"
  | "likesPlural"
  | "commentsSingular"
  | "commentsPlural"
  | "like"
  | "unlike"
  | "reply"
  | "info"
  | "error"
  | "bio"
  | "emptyBio"
  | "relationshipStatus"
  | "gender"
  | "location"
  | "website"
  | "phone"
  | "incoming"
  | "outgoing"
  | "friendSuggestions"
  | "seeNewPosts"
  | "settings"
  | "about"
  | "posts"
  | "photos"
  | "userNotFound"
  | "registrationSuccess"
  | "searchResults"
  | "searchResults"
  | "noUsersFound"
  | "firstNameRequired"
  | "lastNameRequired"
  | "emailRequired"
  | "emailValid"
  | "usernameRequired"
  | "passwordRequired"
  | "confirmPasswordRequired"
  | "confirmPasswordValid"
  | "invalidCredentials"
  | "userSettings"
  | "language"
  | "credentialsSuccess";

type ILocalization = {
  [item in Keys]: string;
};

type ILanguages = {
  [language in Language]: ILocalization;
};

const localization: ILanguages = {
  en: {
    new: "New",
    confirm: "Confirm",
    edit: "Edit",
    save: "Save",
    username: "Username",
    password: "Password",
    repeatPassword: "Confirm password",
    email: "E-mail",
    login: "Login",
    register: "Register",
    newPostPlaceholder: "Start writing...",
    privatePost: "private",
    submit: "Submit",
    firstName: "First name",
    lastName: "Last name",
    backToLogin: "Back to login",
    replyPlaceholder: "Write a reply",
    userSearchPlaceholder: "Search users",
    search: "Search",
    add: "Add",
    addFriend: "Add friend",
    accept: "Accept",
    acceptRequest: "Accept request",
    decline: "Decline",
    declineRequest: "Decline request",
    cancel: "Cancel",
    cancelRequest: "Cancel request",
    remove: "Remove",
    removeFriend: "Remove friend",
    message: "Message",

    messenger: "Messenger",
    friends: "Friends",
    friendRequests: "Friend requests",
    profile: "Profile",
    logout: "Log out",
    pageNotFound: "Page not found",

    return: "Return",

    newPost: "New post!",
    newMessage: "New message!",
    newFriendRequest: "New friend request!",
    from: "From",

    delete: "Delete",
    likesSingular: "like",
    likesPlural: "likes",
    commentsSingular: "comment",
    commentsPlural: "comments",
    like: "Like",
    unlike: "Unlike",
    reply: "Reply",

    error: "Error!",
    info: "Info",

    bio: "Bio",
    emptyBio: "There's nothing here...",
    relationshipStatus: "Relationship status",
    gender: "Gender",
    location: "Location",
    website: "Website",
    phone: "Phone",

    incoming: "Incoming",
    outgoing: "Outgoing",

    friendSuggestions:
      "Looking for people to meet? Here are some friend suggestions...",

    seeNewPosts: "↑ See new posts",

    settings: "Settings",
    about: "About",
    posts: "Posts",
    photos: "Photos",
    userNotFound: "User not found",

    registrationSuccess: "Registration successful!",

    searchResults: "Search results",
    noUsersFound: "No users found",

    firstNameRequired: "First name is required",
    lastNameRequired: "Last name is required",
    emailRequired: "E-mail is required",
    emailValid: "E-mail must be valid",
    usernameRequired: "Username is required",
    passwordRequired: "Password is required",
    confirmPasswordRequired: "Confirm password is required",
    confirmPasswordValid: "Passwords must match",

    invalidCredentials: "Invalid login credentials",

    userSettings: "Korisničke postavke",
    language: "Jezik",
    credentialsSuccess: "Credentials changed successfully!",
  },
  hr: {
    new: "Novo",
    confirm: "Prihvati",
    edit: "Izmijeni",
    save: "Spremi",
    username: "Korisničko ime",
    password: "Lozinka",
    repeatPassword: "Ponovi lozinku",
    email: "E-mail",
    login: "Prijava",
    register: "Registracija",
    newPostPlaceholder: "Počni pisati...",
    privatePost: "privatno",
    submit: "Pošalji",
    firstName: "Ime",
    lastName: "Prezime",
    backToLogin: "Povratak na prijavu",
    replyPlaceholder: "Upiši odgovor",
    userSearchPlaceholder: "Pretraži korisnike",
    search: "Pretraži",
    add: "Dodaj",
    addFriend: "Dodaj prijatelja",
    accept: "Prihvati",
    acceptRequest: "Prihvati zahtjev",
    decline: "Odbij",
    declineRequest: "Odbij zahtjev",
    cancel: "Otkaži",
    cancelRequest: "Otkaži zahtjev",
    remove: "Ukloni",
    removeFriend: "Ukloni prijatelja",
    message: "Pošalji poruku",

    messenger: "Messenger",
    friends: "Prijatelji",
    friendRequests: "Zahtjevi prijateljstva",
    profile: "Profil",
    logout: "Odjava",
    pageNotFound: "Stranica nije pronađena",

    return: "Povratak",

    newPost: "Nova objava!",
    newMessage: "Nova poruka!",
    newFriendRequest: "Novi zahtjev prijateljstva!",
    from: "Od",

    delete: "Obriši",
    likesSingular: "sviđanje",
    likesPlural: "sviđanja",
    commentsSingular: "komentar",
    commentsPlural: "komentara",
    like: "Sviđa mi se",
    unlike: "Više mi se ne sviđa",
    reply: "Odgovori",

    error: "Pogreška!",
    info: "Informacija",

    bio: "Opis",
    emptyBio: "Ovdje nema ničega...",
    relationshipStatus: "Status veze",
    gender: "Spol",
    location: "Lokacija",
    website: "Web stranica",
    phone: "Kontakt broj",

    incoming: "Dolazeći",
    outgoing: "Odlazeći",

    friendSuggestions: "Tražite ljude za upoznati? Izvolite neke prijedloge...",

    seeNewPosts: "↑ Vidi nove objave",

    settings: "Postavke",
    about: "Podatci",
    posts: "Objave",
    photos: "Slike",
    userNotFound: "Korisnik nije pronađen",

    registrationSuccess: "Registracija uspješna!",

    searchResults: "Rezultati pretrage",
    noUsersFound: "Nema pronađenih korisnika",

    firstNameRequired: "Potrebno je unijeti ime",
    lastNameRequired: "Potrebno je unijeti prezime",
    emailRequired: "Potrebno je unijeti e-mail",
    emailValid: "Potrebno je unijeti važeći e-mail",
    usernameRequired: "Potrebno je unijeti korisničko ime",
    passwordRequired: "Potrebno je unijeti lozinku",
    confirmPasswordRequired: "Potrebno je ponovno unijeti lozinku",
    confirmPasswordValid: "Lozinke se moraju podudarati",

    invalidCredentials: "Nevažeći podatci za prijavu",

    userSettings: "Korisničke postavke",
    language: "Jezik",
    credentialsSuccess: "Podatci uspješno promijenjeni!",
  },
};

export const dateLocalization = (
  number: number,
  index: number,
  totalSec?: number
): [string, string] => {
  return [
    ["Upravo", "Upravo"],
    ["Prije %s sekundi", "Za %s sekundi"],
    ["Prije 1 minutu", "Za 1 minutu"],
    ["Prije %s minuta", "Za %s minuta"],
    ["Prije 1 sat", "Za 1 sat"],
    ["Prije %s sati", "Za %s sati"],
    ["Prije 1 dan", "Za 1 dan"],
    ["Prije %s dana", "Za %s dana"],
    ["Prije tjedan dana", "Za tjedan dana"],
    ["Prije %s tjedana", "Za %s tjedana"],
    ["Prije mjesec dana", "Za mjesec dana"],
    ["Prije %s mjeseci", "Za %s mjeseci"],
    ["Prije godinu dana", "Za godinu dana"],
    ["Prije %s godina", "Za %s godina"],
  ][index] as [string, string];
};

register("hr", dateLocalization);

export default localization[LocalStorage.getLanguageToken()];
