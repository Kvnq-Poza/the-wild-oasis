/* eslint-disable no-unused-vars */
import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createUpdateCabin(newCabin, id, origImagePath) {
  // const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  const hasImagePath = typeof newCabin.image === "string";

  const imageName = `${Math.random()}-${newCabin.image.name}`.replace("/", "");
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // https://ghwikrmfofgaubrmapjd.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  // 1. Create/update cabin
  let query = supabase.from("cabins");

  // A) Create
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) Update
  if (id)
    query = query
      .update({ ...newCabin, image: imagePath })
      .eq("id", id)
      .select(); // select() is required to execute the query

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 2. Upload image
  if (!hasImagePath) {
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image);

    // Delete the cabin IF there was an error uploading image
    if (storageError) {
      await supabase.from("cabins").delete().eq("id", data.id);
      console.error(storageError);
      throw new Error(
        "Cabin image could not be uploaded and cabin was not created"
      );
    }

    // 3. Delete the old image from storage if new image is uploaded from "Update"
    if (origImagePath) {
      const { error: deleteExistingImageError } = await supabase.storage
        .from("cabin-images")
        .remove([origImagePath.split("/").pop()]);
      if (deleteExistingImageError) {
        console.error(
          "Existing Image couldn't be deleted",
          deleteExistingImageError
        );
      }
    }
  }
  return data;
}

export async function deleteCabin(cabin) {
  const { data, error } = await supabase
    .from("cabins")
    .delete()
    .eq("id", cabin.id);
  if (error) {
    throw new Error("Failed to delete cabin");
  }
  //delete the image
  const { error: deleteError } = await supabase.storage
    .from("cabin-images")
    .remove([cabin.image.split("/").pop()]);
  if (deleteError) {
    throw new Error("We couldnt delete the image from the database");
  }
  return data;
}
