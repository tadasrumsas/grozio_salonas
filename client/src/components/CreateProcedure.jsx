import { useState } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import Navigation from "./Navigation";
import AdminNavigation from "./admin/AdminNavigation";

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateProcedure() {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      dates: [{ value: "" }],
    },
  });

  // useFieldArray leidžia valdyti dinamišką datų masyvą
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dates",
  });

  const onSubmit = async (formData) => {
    // Transformuojame dates masyvą, kad siuntume tik reikšmes
    const payload = {
      ...formData,
      dates: formData.dates.map((date) => date.value), // ["2025-05-12T14:30", ...]
    };
    console.log("Siunčiami duomenys:", payload);
    try {
      const { data: response } = await axios.post(
        `${API_URL}/procedures`,
        payload,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setMessage("Turą pavyko sukurti!");
      setError(null);
    } catch (error) {
      console.error("Klaida:", error.response?.data);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(
            error.response.data.message || "Įvyko klaida, bandykite dar kartą"
          );
        } else if (error.request) {
          setError("Nėra atsakymo iš serverio. Patikrinkite interneto ryšį");
        } else {
          setError("Kažkas nepavyko. Bandykite dar kartą");
        }
      } else {
        setError("Įvyko netikėta klaida");
      }
    }
  };

  return (
    <>
      <Navigation />
      <AdminNavigation />
      <section className="p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="sm:w-1/2 w-full space-y-4 mx-auto"
        >
          {/* Pavadinimas */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-md font-medium">
              Pavadinimas
            </label>
            <input
              type="text"
              id="title"
              placeholder="Pavadinimas"
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters long",
                },
                maxLength: {
                  value: 40,
                  message: "Title must be at most 40 characters long",
                },
                pattern: {
                  value: /^[\p{L}0-9\s\-',.]+$/u,
                  message:
                    "Title can only contain letters (incl. accented), numbers, spaces, hyphens, apostrophes, commas, and periods",
                },
                validate: (value) =>
                  typeof value === "string" || "Title must be a string",
              })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Nuotrauka */}
          <div className="flex flex-col gap-2">
            <label htmlFor="image" className="text-md font-medium">
              Nuotraukos URL
            </label>
            <input
              type="text"
              id="image"
              placeholder="Nuotraukos URL"
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              {...register("image", {
                required: "Image URL is required",
                minLength: {
                  value: 3,
                  message: "Image URL must be at least 3 characters long",
                },
                maxLength: {
                  value: 200,
                  message: "Image URL must be at most 200 characters long",
                },
                pattern: {
                  value:
                    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=+:@#;]*)?$/i,
                  message: "Image URL must be a valid URL",
                },
              })}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Aprašymas */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-md font-medium">
              Aprašymas
            </label>
            <textarea
              id="description"
              placeholder="Aprašymas"
              className="w-full h-32 resize-none rounded-md border border-gray-300 p-2 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              rows={4}
              {...register("description", {
                required: "Aprašymas yra privalomas",
                minLength: {
                  value: 3,
                  message: "description must be at least 3 characters long",
                },
                maxLength: {
                  value: 1000,
                  message: "description must be at most 1000 characters long",
                },
                pattern: {
                  value: /^[\s\S]*$/,
                  message:
                    "description can only contain letters (incl. accented), numbers, spaces, hyphens, apostrophes, commas, and periods",
                },
                validate: (value) =>
                  typeof value === "string" || "description must be a string",
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Vietovė */}
          <div className="flex flex-col gap-2">
            <label htmlFor="location" className="text-md font-medium">
              Vietovė
            </label>
            <input
              type="text"
              id="location"
              placeholder="Vietovė"
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              {...register("location", {
                required: "location is required",
                minLength: {
                  value: 3,
                  message: "location must be at least 3 characters long",
                },
                maxLength: {
                  value: 100,
                  message: "location must be at most 100 characters long",
                },
                pattern: {
                  value: /^[a-zA-Z0-9\s\-',.]+$/,
                  message:
                    "location can only contain letters, numbers, spaces, hyphens, apostrophes, commas, and periods",
                },
                validate: (value) =>
                  typeof value === "string" || "location must be a string",
              })}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Kategorija */}
          <div className="flex flex-col gap-2">
            <label htmlFor="category_name" className="text-md font-medium">
              Kategorija
            </label>
            <select
              id="category_name"
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              {...register("category_name", {
                required: "Category is required",
                validate: {
                  isString: (value) =>
                    typeof value === "string" || "Category must be a string",
                  isValidCategory: (value) =>
                    ["individual", "groups"].includes(value) ||
                    'Category must be either "individual" or "groups"',
                },
              })}
            >
              <option value="">Pasirinkite...</option>
              <option value="individual">Individual</option>
              <option value="groups">Groups</option>
            </select>
            {errors.category_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category_name.message}
              </p>
            )}
          </div>

          {/* Trukmė */}
          <div className="flex flex-col gap-2">
            <label htmlFor="duration" className="text-md font-medium">
              Trukmė
            </label>
            <input
              type="number"
              id="duration"
              placeholder="Trukmė"
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              {...register("duration", {
                required: "Duration is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Minimum value is 1",
                },
                max: {
                  value: 600,
                  message: "Maximum value is 600",
                },
                validate: (value) =>
                  typeof value === "number" || "duration must be a number",
              })}
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration.message}
              </p>
            )}
          </div>

          {/* Kaina */}
          <div className="flex flex-col gap-2">
            <label htmlFor="price" className="text-md font-medium">
              Kaina
            </label>
            <input
              type="number"
              id="price"
              placeholder="Kaina"
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: {
                  value: 0.01,
                  message: "Minimum value is 0.01",
                },
                max: {
                  value: 10000,
                  message: "Maximum value is 10000",
                },
                validate: (value) =>
                  typeof value === "number" || "price must be a number",
              })}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Datos ir laikas */}
          <div className="flex flex-col gap-2">
            <label className="text-md font-medium">Procedūrų datos</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  {...register(`dates[${index}].value`, {
                    required: "Data ir laikas yra privalomi",
                  })}
                  min={new Date().toISOString().slice(0, 16)} // Neleidžia pasirinkti praeities
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Pašalinti
                </button>
                {errors.dates && errors.dates[index] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dates[index].value?.message}
                  </p>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ value: "" })}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2"
            >
              Pridėti datą
            </button>
          </div>

          {/* Klaidos ir sėkmės pranešimai */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          {/* Pateikimo mygtukas */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-950 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sukurti
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
