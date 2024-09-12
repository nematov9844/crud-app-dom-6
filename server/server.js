export const baseUrl = "https://new-api-db-json.vercel.app/api/crud";

export async function getDataUsers() {
  try {
    const res = await fetch(`${baseUrl}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}


  