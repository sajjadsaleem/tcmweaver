import { db } from '@vercel/postgres';
 
export default async function handler(request, response) {
    const client = await db.connect();

    try{
        client.sql`CREATE TABLE pets( Username varchar(255) , Password varchar(255));`;
        const names = ['demo@gmail.com' , 'demodemo'];
        await client.sql`INSERT INTO users (Username , Password) VALUES (${names[0]} , ${names[1]});`;
    } catch(error)
    {return response.status(500).json({error})}

    const pets = await client.sql`SELECT * FROM Pets`
    return response.status(200).json({pets: pets.rows})

//   try {
//     const petName = request.query.petName;
//     console.log('petname' , petName)
//     const ownerName = request.query.ownerName;
//     if (!petName || !ownerName) throw new Error('Pet and owner names required');
//     await sql`INSERT INTO Pets (Name, Owner) VALUES (${petName}, ${ownerName});`;
//   } catch (error) {
//     return response.status(500).json({ error });
//   }
 
//   const pets = await sql`SELECT * FROM Pets;`;
//   return response.status(200).json({ pets });
}