<script>
    import { afterUpdate } from 'svelte';
    import { preferences } from '../store/preferences';
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';
    export let data = null;

    let title = 'login';
    let fields = {email: '', username: '', password: '', confirmPassword: ''};
    let errors = {email: '', username: '', password: '', confirmPassword: '', noMatch: ''};
    let valid = false;
    let allUsers;
    let openInfo = true;


    afterUpdate(()=> {
        allUsers = data?.users?.data
    })
 
    const handleAuthentication = () => {
        valid = true;
        let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        let validEndings = ['@leadmarvels.com'];
        const res = validEndings.some(endingStr => fields.email.trim().toLowerCase().endsWith(endingStr));

        if (fields.email == "") {
            valid = false;
        } else {
            if (!res) {
                valid = false;
                errors.email = "Must have a Leadmarvels email";
            } else {
                errors.email = "";
            }
        }

        if (fields.username == "") {
            valid = false;
        } else {
            if (fields.username.trim().length <= 4) {
                valid = false;
                errors.username = "Not a valid username";
            } else {
                errors.username = "";
            }
        }

        if (fields.password === "") {
            valid = false;
        } else {
            let lowerCaseLetters = /[a-z]/g;
            if(fields.password.trim().match(lowerCaseLetters)) {  
                errors.password = "";
            } else {
                valid = false;
                errors.password = "Must contain 1 captial & lowercase letter, 1 number, and longer than 8 characters";
            }
            
            // Validate capital letters
            let upperCaseLetters = /[A-Z]/g;
            if(fields.password.trim().match(upperCaseLetters)) {  
                errors.password = "";
            } else {
                valid = false;
                errors.password = "Must contain 1 captial & lowercase letter, 1 number, and longer than 8 characters";
            }

            // Validate numbers
            let numbers = /[0-9]/g;
            if(fields.password.trim().match(numbers)) {  
                errors.password = "";
            } else {
                valid = false;
                errors.password = "Must contain 1 captial & lowercase letter, 1 number, and longer than 8 characters";
            }
            
            // Validate length
            if(fields.password.trim().length >= 7) {
                errors.password = "";
            } else {
                valid = false;
                errors.password = "Must contain 1 captial & lowercase letter, 1 number, and longer than 8 characters";
            }
        }
    }

    const updateLocalStorageWithUserCredentials = () => {
        preferences.update(currentPreferences => {
            let currentUser = allUsers.filter((item) => {
                if (item.email === fields.email) {
                    return item;
                }
            });

            let filterArray = [...currentPreferences, currentUser[0]];
            let unique = [...new Set(filterArray)];
            const removeNull = unique.filter(element => element !== null)
            return [...removeNull];
        });

        if (valid) {
            window.location.replace("/suggestions");
        }
    }

    const handleUserCredentials = () => {
        if (title === 'register') {
            setTimeout(updateLocalStorageWithUserCredentials, 1500)
        } else {
            if (allUsers.length !== 0) {
                allUsers.forEach(item => {
                    if ((item.email === fields.email) && (item.password === fields.password)) {
                        setTimeout(updateLocalStorageWithUserCredentials, 1500)
                    } else {
                        errors.noMatch = 'Credentials does not match our records';
                    }
                })
            } else {
                errors.noMatch = 'Credentials does not match our records';
            }
        }
    }
</script>

<div class="relative flex flex-col items-center justify-center flex-1 p-6 text-white min-h-screen bg-[#011446]">
    {#if title === "register"}
        <form method="POST" action="?/register" enctype="multipart/form-data" use:enhance class="flex flex-col gap-5 w-[25rem] max-w-full mx-auto" autocomplete="on">
            <h1 class="text-center text-5xl mb-4 capitalize">{title}</h1>
            <label class="relative border border-black rounded-md">
                <p class={fields.username ? " above" : " center"}>Username</p>
                <input 
                    on:keyup={handleAuthentication}
                    on:blur={()=>{
                        allUsers.forEach(element => {
                            if (fields.username.trim() === element.username) {
                                valid = false;
                                errors.username = "Username already in use";
                            } else {
                                valid = true;
                                errors.username = "";
                            }
                        })
                    }}
                    bind:value={fields.username}
                    type="text"
                    id="username"
                    name="username"
                    class="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-2 ring-inset {errors.username !== "" ? "ring-red-500" : "ring-white"} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    placeholder="Username"
                    required />
                <p class="text-red-500 text-[0.9rem] text-center">{errors.username}</p>
            </label>
            <label class="relative border border-black rounded-md">
                <p class={fields.email ? " above" : " center"}>Email</p>
                <input 
                    on:keyup={handleAuthentication}
                    on:blur={()=>{
                        allUsers.forEach(element => {
                            if (fields.email.trim() === element.email) {
                                valid = false;
                                errors.email = "Email already in use";
                            } else {
                                valid = true;
                                errors.email = "";
                            }
                        })
                    }}
                    bind:value={fields.email}
                    type="email"
                    id="email"
                    name="email"
                    class="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-2 ring-inset {errors.email !== "" ? "ring-red-500" : "ring-white"} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    placeholder="Email"
                    required />
                <p class="text-red-500 text-[0.9rem] text-center">{errors.email}</p>
            </label>
            <label class="relative border border-black rounded-md">
                <p class={fields.password ? " above" : " center"}>Password</p>
                <input 
                    on:keyup={handleAuthentication}
                    bind:value={fields.password}
                    type="password"
                    id="password"
                    name="password"
                    class="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-2 ring-inset {errors.password !== "" ? "ring-red-500" : "ring-white"} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    placeholder="Password"
                    required />
                <p class="text-red-500 text-[0.9rem] text-center">{errors.password}</p>
            </label>
            <button disabled={!valid} on:click={handleUserCredentials} type="submit" class="grid place-items-center bg-[#2CC320] hover:bg-[#33db25] text-white border-none py-3.5 px-0 rounded-md cursor-pointer text-base">
                Submit
            </button>
        </form>
    {:else}
        <form on:submit|preventDefault={handleUserCredentials} class="flex flex-col gap-5 w-[25rem] max-w-full mx-auto" autocomplete="on">
            <h1 class="text-center text-5xl mb-4 capitalize">{title}</h1>
            <label class="relative border border-black rounded-md">
                <p class={fields.email ? " above" : " center"}>Email</p>
                <input 
                    bind:value={fields.email}
                    on:blur={()=>{
                        allUsers.forEach(element => {
                            if (fields.email.trim() !== element.email) {
                                valid = false;
                                errors.email = "Email does not match";
                            } else {
                                valid = true;
                                errors.email = "";
                            }
                        })
                    }}
                    type="email"
                    id="email"
                    name="email"
                    class="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-2 ring-inset {errors.email !== "" ? "ring-red-500" : "ring-white"} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    placeholder="Email"
                    required />
                <p class="text-red-500 text-[0.9rem] text-center">{errors.email}</p>
            </label>
            <label class="relative border border-black rounded-md">
                <p class={fields.password ? " above" : " center"}>Password</p>
                <input 
                    bind:value={fields.password}
                    on:blur={()=>{
                        allUsers.forEach(element => {
                            if (fields.password.trim() !== element.password) {
                                valid = false;
                                errors.password = "Password does not match";
                            } else {
                                valid = true;
                                errors.password = "";
                            }
                        })
                    }}
                    type="password"
                    id="password"
                    name="password"
                    class="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-2 ring-inset {errors.password !== "" ? "ring-red-500" : "ring-white"} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    placeholder="Password"
                    required />
                <p class="text-red-500 text-[0.9rem] text-center">{errors.password}</p>
            </label>
            <button disabled={!valid} on:click={handleUserCredentials} type="submit" class="grid place-items-center bg-[#2CC320] hover:bg-[#33db25] text-white border-none py-3.5 px-0 rounded-md cursor-pointer text-base">
                Submit
            </button>
        </form>
    {/if}
    <div class="options flex flex-col gap-1 text-[0.9rem] py-3.5 px-0 w-[25rem] max-w-full mx-auto overflow-hidden">
        <div class="text-center text-red-400">
            <p>{errors.noMatch}</p>
        </div>
        <p>Or</p>
        {#if title === "register"}
            <div class="flex items-center gap-2 justify-center">
                <p>Already have an account?</p>
                <span on:keydown={()=>{}} on:click={()=>{title = 'login'}}>Login</span>
            </div>
        {:else}
            <div class="flex items-center gap-2 justify-center">
                <p>Don't have an account?</p>
                <span on:keydown={()=>{}} on:click={()=>{title = 'register'}}>Register</span>
            </div>
        {/if}
    </div>
    <div class="hidden sm:block fixed left-4 bottom-4">
        {#if openInfo}
            <div class="absolute left-0 -top-20 bg-white rounded-[0.625rem] w-[25rem] p-4 text-gray-800">
                <button on:click={()=>{openInfo = false}} type="button" class="absolute right-2 top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" /></svg>                  
                </button>
                <p>This test app is only for Leadmarvel's employees.</p>
                <p>Please do not use real passwords, thank you!</p>
            </div>
        {/if}
        <div on:keydown={()=>{}} on:click={()=>{openInfo = true}} class="cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" /></svg>
        </div>
    </div>
</div>
 
<style>
    * {
        border-style: none;
    }
    .above,
    .center {
        position: absolute;
        transform: translateY(-50%);
        pointer-events: none;
        color: #FFFFFF;
        border-radius: 0.25rem;
        padding: 0 0.375rem;
        font-size: 1rem;
    }
    .above {
        top: 0;
        left: 1.5rem;
        background-color: #459ff5;
        font-size: 1rem;
        color: #FFFFFF;
        box-shadow: 0.25rem 0.25rem 0.375rem rgba(80, 70, 229, 0.5);
    }
    .center {
        top: 50%;
        left: 0.375rem;
        border: 0.0625rem solid transparent;
        opacity: 0;
    }
    .options > p {
        position: relative;
        text-align: center;
        width: fit-content;
        margin: 0 auto;
        padding: 0 0.5rem;
    }
    .options > p::after,
    .options > p::before {
        position: absolute;
        content: "";
        top: 50%;
        transform: translateY(-50%);
        width: 100vw;
        height: 0.09375rem;
        background-color: #FFFFFF;
    }
    .options > p::after {
        right: 100%;
    }
    .options > p::before {
        left: 100%;
    }
    .options div span {
        color: cyan;
        cursor: pointer;
    }
</style>