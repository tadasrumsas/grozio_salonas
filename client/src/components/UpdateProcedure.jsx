import { useState, useEffect } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "react-router";

const API_URL = import.meta.env.VITE_API_URL;

export default function UpdateProcedure() {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      dates: [{ value: "" }],
    },
  });

  useEffect(() => {
    const fetchProcedure = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get(
          `${API_URL}/procedures/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log("Pilnas API atsakymas:", JSON.stringify(response, null, 2));

        // Patikriname, ar response.data yra masyvas ir turi duomenų
        if (
          !response.data ||
          !Array.isArray(response.data) ||
          response.data.length === 0
        ) {
          throw new Error("Turo duomenys nerasti");
        }

        const procedure = response.data[0]; // Gauname pirmąjį turo objektą

        // Užpildome formą su gautais duomenimis
        setValue("title", procedure.title || "");
        setValue("image", procedure.image || "");
        setValue("description", procedure.description || "");
        setValue("location", procedure.location || "");
        setValue("category_name", procedure.category_name || "");
        setValue("duration", Number(procedure.duration) || 0);
        setValue("price", Number(procedure.price) || 0);
        setValue("rating", Number(procedure.rating) || 0);

        // Transformuojame dates masyvą
        const formattedDates = Array.isArray(procedure.dates)
          ? procedure.dates.map((date) => ({
              value: new Date(date.date_time).toISOString().slice(0, 16), // Pvz., "2025-07-01T07:00"
            }))
          : [{ value: "" }];
        setValue(
          "dates",
          formattedDates.length > 0 ? formattedDates : [{ value: "" }]
        );
      } catch (error) {
        setError("Nepavyko užkrauti turo duomenų. Bandykite dar kartą.");
        console.error("Klaida:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProcedure();
    }
  }, [id, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dates",
  });

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      dates: formData.dates.map((date) => date.value), // ["2025-07-01T07:00", ...]
    };
    console.log("Siunčiami duomenys:", payload);
    try {
      const { data: response } = await axios.patch(
        `${API_URL}/procedures/${id}`,
        payload,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setMessage("Turą pavyko atnaujinti!");
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
    <section className="p-4">
      {loading && <p>Kraunama...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!loading && (
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
                required: "Pavadinimas yra privalomas",
                minLength: {
                  value: 3,
                  message: "Pavadinimas turi būti bent 3 simbolių ilgio",
                },
                maxLength: {
                  value: 40,
                  message: "Pavadinimas turi būti ne ilgesnis nei 40 simbolių",
                },
                pattern: {
                  value: /^[\p{L}0-9\s\-',.]+$/u,
                  message:
                    "Pavadinime gali būti tik raidės (įskaitant lietuviškas), skaičiai, tarpai, brūkšneliai, kableliai ir taškai",
                },
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
                required: "Nuotraukos URL yra privalomas",
                minLength: {
                  value: 3,
                  message: "Nuotraukos URL turi būti bent 3 simbolių ilgio",
                },
                maxLength: {
                  value: 200,
                  message:
                    "Nuotraukos URL turi būti ne ilgesnis nei 200 simbolių",
                },
                pattern: {
                  value:
                    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=+:@#;]*)?$/i,
                  message: "Nuotraukos URL turi būti galiojantis URL",
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
                  message: "Aprašymas turi būti bent 3 simbolių ilgio",
                },
                maxLength: {
                  value: 1000,
                  message: "Aprašymas turi būti ne ilgesnis nei 1000 simbolių",
                },
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
                required: "Vietovė yra privaloma",
                minLength: {
                  value: 3,
                  message: "Vietovė turi būti bent 3 simbolių ilgio",
                },
                maxLength: {
                  value: 100,
                  message: "Vietovė turi būti ne ilgesnė nei 100 simbolių",
                },
                pattern: {
                  value: /^[a-zA-Z0-9\s\-',.]+$/,
                  message:
                    "Vietovėje gali būti tik raidės, skaičiai, tarpai, brūkšneliai, kableliai ir taškai",
                },
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
                required: "Kategorija yra privaloma",
                validate: {
                  isValidCategory: (value) =>
                    ["individual", "groups"].includes(value) ||
                    'Kategorija turi būti "individual" arba "groups"',
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
                required: "Trukmė yra privaloma",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Mažiausia reikšmė yra 1",
                },
                max: {
                  value: 600,
                  message: "Didžiausia reikšmė yra 600",
                },
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
              step="0.01"
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              {...register("price", {
                required: "Kaina yra privaloma",
                valueAsNumber: true,
                min: {
                  value: 0.01,
                  message: "Mažiausia reikšmė yra 0.01",
                },
                max: {
                  value: 10000,
                  message: "Didžiausia reikšmė yra 10000",
                },
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
                  min={new Date().toISOString().slice(0, 16)}
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
          {message && <p className="text-green-500 text-sm">{message}</p>}

          {/* Pateikimo mygtukas */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-950 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Atnaujinti
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
