export interface client {
    id:number
    nom:string
    prenom:string
    email:string
    mot_de_passe:string
    telephone:string
    adresse:string
}

export interface Produit {
    id:string
    nom:string
    description:string
    prix:string
    stock:number
    image:string
}