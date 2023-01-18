<script>
import axios from 'axios';
import { API_URL } from "../../environements";

const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NzQwNjEzMDYsImV4cCI6MTY3NDA2NDkwNiwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluQGV4YW1wbGUuY29tIn0.qE9tr-Ta9aRl-XWTTVANlausKhvxZVGu_oLlqtlHkgDuH2aT6fN1XyVvAj0izg3J_MlaIAceUJCPQbyRft-rf6HgeEroqdRM4H9TKof18NV61VQKac3-GNlrWviTmqEUF5KH49u0OkBQnDffUlR_QSxkXaMwHIQi4_skww_esSuEFRHKst5y6A-9bjFKixnRdKrZYRaioWu4gR2oyA32tQAzrnNsXgyeixzxkZmHEs57ozN6uTzKLiTrLdeAoV-x8n0fVtyPxoqibstc3Z8Y3GGx7b90NZ6SdVigz9KTO_o5A3VbfV7cCr9D1QVDfsArDSOmzxf4bweyRW7MyNDSTKfwaqs86v3A21pgwBcNL5dhWccEoVwXIqzxOnzuW8sEwNIl-elzjdKIa_ccvMQ8idJfxDxmou08A0QpzmSSxI5c1oDAqqz09rFqjYPYHySqi7JS39Pc44YK3gCilDa3QdEXIy4SM9XdF0DiuhBflkCXk7IG-L9PK1IPTqqCAZNPysvz5A6fcsxfAq4r7JwfT4q7z40x20-By6Z-i8eg69769XPHUZJL_MjcJbm9f5NDe8d_ua1C81mwYy_optKCDms01ulifENYXuM_G7mrHP6wao6c69q00AVun7WckMArcNAW7XatME8ii9xCdz6cIzeqlnwBCiaYkVRnrWqaOeE'

export default {
    data() {
        return {
            user: {
                id: null,
                firstname: '',
                lastname: '',
                email: '',
                roles: '',
                createdAt: '',
            }
        }
    },
    methods: {
        getUser(userId) {
            axios.get(`${API_URL}/users/${userId}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + TOKEN
                    }
                })
                .then(response => {
                    this.user = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },
    mounted() {
        this.getUser(3);
    }
}
</script>
<template>

    <div
        class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div class="flex justify-end px-4 pt-4">
            <button id="dropdownButton" data-dropdown-toggle="dropdown"
                class="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                type="button">
                <span class="sr-only">Open dropdown</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z">
                    </path>
                </svg>
            </button>
            <!-- Dropdown menu -->
            <div id="dropdown"
                class="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700">
                <ul class="py-1" aria-labelledby="dropdownButton">
                    <li>
                        <a href="#"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
                    </li>
                    <li>
                        <a href="#"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export
                            Data</a>
                    </li>
                    <li>
                        <a href="#"
                            class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="flex flex-col items-center pb-10">
            <img class="w-24 h-24 mb-3 rounded-full shadow-lg" src="/docs/images/people/profile-picture-3.jpg" alt="" />
            <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white"> {{ user.firstname }} {{ user.lastname }}
            </h5>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ user.roles }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ user.createdAt }}</span>

        </div>
    </div>


</template>

<style>
.container {
    display: flex;
}
</style>
