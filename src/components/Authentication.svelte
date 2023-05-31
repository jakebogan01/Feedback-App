<script>
    import { afterUpdate } from 'svelte';
    import { preferences } from '../store/preferences';
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';
    export let data = null;

    let title = 'login';
    let fields = {email: '', password: '', confirmPassword: ''};
    let errors = {email: '', password: '', confirmPassword: '', noMatch: ''};
    let valid = false;
    let allUsers;


    afterUpdate(()=> {
        allUsers = data?.users?.data
    })
 
    //  const handleAuthentication = () => {
    //      valid = true;
 
    //      if (fields.email.trim().length < 2) {
    //          valid = false;
    //          errors.email = "Not a valid email";
    //      } else {
    //          errors.email = "";
    //      }
 
    //      if (fields.password.trim().length < 8) {
    //          valid = false;
    //          errors.password = "Must be at least 8 characters long";
    //      } else {
    //          errors.password = "";
    //      }
 
    //      if (title === "register" && fields.confirmPassword.trim() !== fields.password.trim()) {
    //          valid = false;
    //          errors.confirmPassword = "Password does not match";
    //      } else {
    //          errors.confirmPassword = "";
    //      }
    //  }

    const updateLocalStorageWithUserCredentials = () => {
        preferences.update(currentPreferences => {
            let currentUser = allUsers.filter((item) => {
                if (item.email === fields.email) {
                    return item;
                }
            });

            let filterArray = [...currentPreferences, currentUser[0]];
            let unique = [...new Set(filterArray)];
            
            return [...unique];
        });

        if (!valid) {
            goto('/suggestions');
        }
    }

    const handleUserCredentials = () => {
        if (title === 'register') {
            setTimeout(updateLocalStorageWithUserCredentials, 1500)
        } else {
            if (allUsers.length >= 1) {
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

<div class="flex flex-col items-center justify-center flex-1 p-6 text-white min-h-screen bg-[#011446]">
    {#if title === "register"}
        <form method="POST" action="?/register" enctype="multipart/form-data" use:enhance class="flex flex-col gap-5 w-[25rem] max-w-full mx-auto">
            <h1 class="text-center text-5xl mb-4 capitalize">{title}</h1>
            <label class="relative border border-black rounded-md">
                <p class={fields.email ? " above" : " center"}>Email</p>
                <input 
                    bind:value={fields.email}
                    type="email"
                    id="email"
                    name="email"
                    class="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    placeholder="Email"
                    required />
                <p class="text-cyan-300 text-[0.9rem] text-center">{errors.email}</p>
            </label>
            <label class="relative border border-black rounded-md">
                <p class={fields.password ? " above" : " center"}>Password</p>
                <input 
                    bind:value={fields.password}
                    type="password"
                    id="password"
                    name="password"
                    class="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    placeholder="Password"
                    required />
                <p class="text-cyan-300 text-[0.9rem] text-center">{errors.password}</p>
            </label>
            <label class="relative border border-black rounded-md">
                <p class={fields.confirmPassword ? " above" : " center"}>Confirm Password</p>
                <input 
                    bind:value={fields.confirmPassword}
                    type="password" 
                    class="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    placeholder="Confirm Password"
                    required />
                <p class="text-cyan-300 text-[0.9rem] text-center">{errors.confirmPassword}</p>
            </label>
            <button on:click={handleUserCredentials} type="submit" class="grid place-items-center bg-[#2CC320] hover:bg-[#33db25] text-white border-none py-3.5 px-0 rounded-md cursor-pointer text-base">
                Submit
            </button>
        </form>
    {:else}
        <form on:submit|preventDefault={handleUserCredentials} class="flex flex-col gap-5 w-[25rem] max-w-full mx-auto">
            <h1 class="text-center text-5xl mb-4 capitalize">{title}</h1>
            <label class="relative border border-black rounded-md">
                <p class={fields.email ? " above" : " center"}>Email</p>
                <input 
                    bind:value={fields.email}
                    type="email"
                    id="email"
                    name="email"
                    class="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    placeholder="Email"
                    required />
                <p class="text-cyan-300 text-[0.9rem] text-center">{errors.email}</p>
            </label>
            <label class="relative border border-black rounded-md">
                <p class={fields.password ? " above" : " center"}>Password</p>
                <input 
                    bind:value={fields.password}
                    type="password"
                    id="password"
                    name="password"
                    class="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    placeholder="Password"
                    required />
                <p class="text-cyan-300 text-[0.9rem] text-center">{errors.password}</p>
            </label>
            <button on:click={handleUserCredentials} type="submit" class="grid place-items-center bg-[#2CC320] hover:bg-[#33db25] text-white border-none py-3.5 px-0 rounded-md cursor-pointer text-base">
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