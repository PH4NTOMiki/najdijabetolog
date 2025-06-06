// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: number;
				username: string;
				email: string;
				password: string?;
				created_at: string;
				role: 'admin' | 'user';
				stores_owned: number[];
				exp: number?;
				iat: number?;
			}
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface City {
			id: number;
			created_at: string;
			name: string;
		}
		interface Institution {
			id: number;
			created_at: string;
			name: string;
			city: City;
			number_of_doctors: number;
			rating: number;
			bio: string;
		}
		interface Doctor {
			id: number;
			created_at: string;
			first_name: string;
			last_name: string;
			city: City;
			institution: Institution;
			rating: number;
			ratingskill: number;
			ratingkindness: number;
			ratingethicality: number;
			bio: string;
			profile_picture: string;
		}
		interface Review {
			id: number;
			email: string;
			created_at: string;
			doctor: Doctor;
			instituion: Institution;
			comment: string;
			created_by: string;
			rating: number;
			ratingskill: number;
			ratingkindness: number;
			ratingethicality: number;
			ratinginstitution: number;
		}
	}
	L = import('@types/leaflet')
}

export {};
