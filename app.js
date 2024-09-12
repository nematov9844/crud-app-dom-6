const box = document.querySelector(".box");
const form = document.querySelector(".form");
const inputs = document.querySelectorAll(".inputs");
const btn = document.getElementById("btn");

import { getDataUsers, baseUrl } from "./server/server.js";

btn.addEventListener("click", async (e) => {
    e.preventDefault();
    let obj = {};
    Array.from(inputs).forEach((input) => {
        obj[input.name] = input.value;  
        input.value = ""
    });

    try {
        const res = await fetch(`${baseUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });

        if (!res.ok) {
            throw new Error('Foydalanuvchini yaratishda xatolik yuz berdi');
        }

        const data = await res.json();
        console.log('Yangi foydalanuvchi qo\'shildi:', data);

    } catch (error) {
        console.log(error);
    }
    renderUsers();
});

async function renderUsers() {
    const data = await getDataUsers();
    box.innerHTML = data.map((item) => {
        return `
        <div class="grid grid-cols-4 gap-4 mt-5">
        <h1 class="text-xl font-bold">${item.name}</h1>
        <h1 class="text-xl font-semibold">${item.hobby}</h1>
        <button data-edit=${item.id} class="py-1 px-2 bg-green-500 rounded-md text-white">Edit</button>
        <button data-delete=${item.id} class="py-1 px-2 bg-red-500 rounded-md text-white">Delete</button>
        </div>
        `;
    }).join("");
}

renderUsers();

box.addEventListener("click", async (e) => {
    const editId = e.target.dataset.edit;
    const deleteId = e.target.dataset.delete;
    
    if (editId) {
        let obj = {};

        try {
            const resData = await fetch(`${baseUrl}/${editId}`);
            const datares = await resData.json();
            obj = { ...datares };
        } catch (error) {
            console.log(error);
        }

        Array.from(inputs).forEach((input) => {
            if (input.name === "name") {
                input.value = obj.name;
            } else if (input.name === "hobby") {
                input.value = obj.hobby;
            }
        });

        form.onsubmit = async (e) => {
            e.preventDefault();
            Array.from(inputs).forEach((input) => {
                if (input.name === "name") {
                    input.value !== "" ? obj.name = input.value: null
                    
                } else if (input.name === "hobby") {
                  input.value !== "" ?  obj.hobby = input.value: null
                }
            });

            try {
                const res = await fetch(`${baseUrl}/${editId}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(obj)
                });

                if (!res.ok) {
                    throw new Error('Ma\'lumotni yangilashda xatolik yuz berdi');
                }

                console.log(`Ma'lumot yangilandi: ${editId}`);
                renderUsers();
            } catch (error) {
                console.log(error);
            }
        };
        renderUsers();

    }

    if (deleteId) {
        try {
            const res = await fetch(`${baseUrl}/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error('Ma\'lumotni o\'chirishda xatolik yuz berdi');
            }

            console.log(`Ma'lumot o'chirildi: ${deleteId}`);
            renderUsers(); 
        } catch (error) {
            console.log(error.message);
        }
        renderUsers();

    }
});
