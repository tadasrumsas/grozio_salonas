const { sql } = require("../dbConnection");

exports.createProcedure = async (procedureData) => {
  const {
    title,
    image,
    description,
    location,
    category_name,
    duration,
    price,
    rating = 0,
    user_id,
    dates,
  } = procedureData;

  return await sql.begin(async (sql) => {

    const category = await sql`
      SELECT id FROM categories WHERE name = ${category_name};
    `;

    if (!category[0]) {
      throw new Error(`Kategorija "${category_name}" nerasta.`);
    }

    const category_id = category[0].id;

    const procedureInsertData = {
      title,
      image,
      description,
      location,
      category_id,
      duration,
      price,
      rating,
      user_id,
    };

    const procedureResult = await sql`
      INSERT INTO procedures ${sql(
        procedureInsertData,
        "title",
        "image",
        "description",
        "location",
        "category_id",
        "duration",
        "price",
        "rating",
        "user_id"
      )}
      RETURNING *;
    `;

    const procedure = procedureResult[0];

    let createdDates = [];

    if (Array.isArray(dates) && dates.length > 0) {
      createdDates = await Promise.all(
        dates.map(async (date) => {
          const dateResult = await sql`
            INSERT INTO procedure_dates ${sql(
              { procedure_id: procedure.id, date_time: date },
              "procedure_id",
              "date_time"
            )}
            RETURNING *;
          `;
          return dateResult[0];
        })
      );
    }

    return {
      procedure,
      dates: createdDates,
    };
  });
};
exports.updateProcedureModel = async (
  procedureId,
  procedureData,
  userId = null
) => {
  const {
    title,
    image,
    description,
    location,
    category_name,
    duration,
    price,
    rating,
    dates,
  } = procedureData;

 
  let category_id;
  if (category_name) {
    const [category] =
      await sql`SELECT id FROM categories WHERE name = ${category_name}`;
    if (!category) {
      throw new Error(`Kategorija "${category_name}" nerasta.`);
    }
    category_id = category.id;
  }

 
  const fieldsToUpdate = {
    title,
    image,
    description,
    location,
    category_id,
    duration,
    price,
    rating,
  };

  const validFields = Object.fromEntries(
    Object.entries(fieldsToUpdate).filter(([_, value]) => value !== undefined)
  );


  const condition = userId ? sql`AND user_id = ${userId}` : sql``;
  const [procedure] = await sql`
    UPDATE procedures 
    SET ${sql(validFields)}
    WHERE id = ${procedureId} ${condition}
    RETURNING *
  `;

  if (!procedure) {
    throw new Error(
      `Procedura su ID ${procedureId} nerasta arba neturi teisių.`
    );
  }


  let updatedDates = [];
  if (Array.isArray(dates) && dates.length > 0) {

    await sql`DELETE FROM procedure_dates WHERE procedure_id = ${procedureId}`;


    updatedDates = await Promise.all(
      dates.map(async (date) => {
        const [inserted] = await sql`
          INSERT INTO procedure_dates (procedure_id, date_time)
          VALUES (${procedureId}, ${date})
          RETURNING *
        `;
        return inserted;
      })
    );
  }

  return { procedure, dates: updatedDates };
};

exports.deleteProcedureModel = async (procedureId) => {

  await sql`
    DELETE FROM reviews WHERE procedure_id = ${procedureId}
  `;

  await sql`
    DELETE FROM procedure_dates WHERE procedure_id = ${procedureId}
  `;


  const result = await sql`
    DELETE FROM procedures WHERE id = ${procedureId}
    RETURNING *
  `;

  if (result.length === 0) {
    throw new Error(`Procedura su ID ${procedureId} nerasta.`);
  }

  return result[0];
};

exports.getAllProceduresModel = async () => {
  const procedures = await sql`
    SELECT 
      procedures.id,
      procedures.title,
      procedures.image,
      procedures.description,
      procedures.location,
      procedures.category_id,
      procedures.user_id,
      procedures.duration,
      procedures.price,
      procedures.rating,
      procedures.created_at,
      categories.name AS category_name,
      COALESCE(
        json_agg(
          json_build_object('id', procedure_dates.id, 'date_time', procedure_dates.date_time)
        ) FILTER (WHERE procedure_dates.id IS NOT NULL), '[]'
      ) AS dates
    FROM procedures
    JOIN categories ON procedures.category_id = categories.id
    LEFT JOIN procedure_dates ON procedures.id = procedure_dates.procedure_id
    GROUP BY 
      procedures.id,
      procedures.title,
      procedures.image,
      procedures.description,
      procedures.location,
      procedures.category_id,
      procedures.user_id,
      procedures.duration,
      procedures.price,
      procedures.rating,
      procedures.created_at,
      categories.name
  `;
  return procedures;
};

exports.getProcedureByIdModel = async (id) => {
  const procedure = await sql`
    SELECT 
      procedures.id,
      procedures.title,
      procedures.image,
      procedures.description,
      procedures.location,
      procedures.category_id,
      procedures.user_id,
      procedures.duration,
      procedures.price,
      procedures.rating,
      procedures.created_at,
      categories.name AS category_name,
      COALESCE(
        json_agg(
          json_build_object('id', procedure_dates.id, 'date_time', procedure_dates.date_time)
        ) FILTER (WHERE procedure_dates.id IS NOT NULL), '[]'
      ) AS dates
    FROM procedures
    JOIN categories ON procedures.category_id = categories.id
    LEFT JOIN procedure_dates ON procedures.id = procedure_dates.procedure_id
    WHERE procedures.id = ${id}
    GROUP BY 
      procedures.id,
      procedures.title,
      procedures.image,
      procedures.description,
      procedures.location,
      procedures.category_id,
      procedures.user_id,
      procedures.duration,
      procedures.price,
      procedures.rating,
      procedures.created_at,
      categories.name
  `;
  return procedure;
};

exports.filterProcedures = async (filter) => {
  try {
    const validDirections = ["ASC", "DESC"];
    const validSortFields = ["title", "rating"];

    const sortDirection = validDirections.includes(
      filter.sort_direction?.toUpperCase()
    )
      ? filter.sort_direction.toUpperCase()
      : "ASC";

    const sortField = validSortFields.includes(filter.sort_field)
      ? filter.sort_field
      : "title";

    const limit = parseInt(filter.limit) || 10;
    const offset =
      parseInt(filter.page) > 1 ? (parseInt(filter.page) - 1) * limit : 0;

    const safeSearch = filter.search ? filter.search.replace(/'/g, "''") : null;

    const searchCondition = safeSearch
      ? `AND (
            procedures.title ILIKE '%${safeSearch}%' OR
            EXISTS (
              SELECT 1 FROM procedure_dates 
              WHERE procedure_dates.procedure_id = procedures.id 
              AND CAST(procedure_dates.date_time AS TEXT) ILIKE '%${safeSearch}%'
            )
         )`
      : "";

    const categoryCondition = filter.category
      ? `AND categories.name = '${filter.category.replace(/'/g, "''")}'`
      : "";

    const whereClause = `
      WHERE 1=1
      ${searchCondition}
      ${categoryCondition}
    `;

    const query = `
      SELECT 
        procedures.id,
        procedures.title,
        procedures.image,
        procedures.description,
        procedures.location,
        procedures.category_id,
        procedures.user_id,
        procedures.duration,
        procedures.price,
        procedures.rating,
        procedures.created_at,
        categories.name AS category_name,
        COALESCE(
          json_agg(
            json_build_object('id', procedure_dates.id, 'date_time', procedure_dates.date_time)
          ) FILTER (WHERE procedure_dates.id IS NOT NULL), '[]'
        ) AS dates
      FROM procedures
      JOIN categories ON procedures.category_id = categories.id
      LEFT JOIN procedure_dates ON procedures.id = procedure_dates.procedure_id
      ${whereClause}
      GROUP BY procedures.id, categories.name
      ORDER BY procedures.${sortField} ${sortDirection}
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT procedures.id) AS total
      FROM procedures
      JOIN categories ON procedures.category_id = categories.id
      LEFT JOIN procedure_dates ON procedures.id = procedure_dates.procedure_id
      ${whereClause}
    `;

    const [procedures, countResult] = await Promise.all([
      sql.unsafe(query),
      sql.unsafe(countQuery),
    ]);

    const total = countResult[0]?.total || 0;

    return { procedures, total };
  } catch (error) {
    console.error("Error in filterProcedures:", error);
    throw error;
  }
};
