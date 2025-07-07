const { sql } = require('../dbConnection');

exports.createTour = async (tourData) => {
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
    dates
  } = tourData;

  return await sql.begin(async (sql) => {
    // 1. Gauti kategorijos ID
    const category = await sql`
      SELECT id FROM categories WHERE name = ${category_name};
    `;

    if (!category[0]) {
      throw new Error(`Kategorija "${category_name}" nerasta.`);
    }

    const category_id = category[0].id;


    const tourInsertData = {
      title,
      image,
      description,
      location,
      category_id,
      duration,
      price,
      rating,
      user_id
    };

    const tourResult = await sql`
      INSERT INTO tours ${sql(
      tourInsertData,
      'title',
      'image',
      'description',
      'location',
      'category_id',
      'duration',
      'price',
      'rating',
      'user_id'
    )}
      RETURNING *;
    `;

    const tour = tourResult[0];

    // 3. Įterpti datas, jei pateiktos
    let createdDates = [];

    if (Array.isArray(dates) && dates.length > 0) {
      createdDates = await Promise.all(
        dates.map(async (date) => {
          const dateResult = await sql`
            INSERT INTO tour_dates ${sql(
            { tour_id: tour.id, date_time: date },
            'tour_id',
            'date_time'
          )}
            RETURNING *;
          `;
          return dateResult[0];
        })
      );
    }

    return {
      tour,
      dates: createdDates
    };
  });
};
exports.updateTourModel = async (tourId, tourData, userId = null) => {
  const { title, image, description, location, category_name, duration, price, rating, dates } = tourData;

  // 1. Gauti kategorijos ID, jei pateikta category_name
  let category_id;
  if (category_name) {
    const [category] = await sql`SELECT id FROM categories WHERE name = ${category_name}`;
    if (!category) {
      throw new Error(`Kategorija "${category_name}" nerasta.`);
    }
    category_id = category.id;
  }

  // 2. Surinkti atnaujinamus laukus
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
  // Pašalinti undefined laukus
  const validFields = Object.fromEntries(
    Object.entries(fieldsToUpdate).filter(([_, value]) => value !== undefined)
  );

  // 3. Atnaujinti ekskursiją
  const condition = userId ? sql`AND user_id = ${userId}` : sql``;
  const [tour] = await sql`
    UPDATE tours 
    SET ${sql(validFields)}
    WHERE id = ${tourId} ${condition}
    RETURNING *
  `;

  if (!tour) {
    throw new Error(`Ekskursija su ID ${tourId} nerasta arba neturi teisių.`);
  }

  // 4. Atnaujinti datas, jei pateiktos
  let updatedDates = [];
  if (Array.isArray(dates) && dates.length > 0) {
    // Ištrinti senas datas
    await sql`DELETE FROM tour_dates WHERE tour_id = ${tourId}`;
    
    // Įrašyti naujas datas
    updatedDates = await Promise.all(
      dates.map(async (date) => {
        const [inserted] = await sql`
          INSERT INTO tour_dates (tour_id, date_time)
          VALUES (${tourId}, ${date})
          RETURNING *
        `;
        return inserted;
      })
    );
  }

  return { tour, dates: updatedDates };
};


exports.deleteTourModel = async (tourId) => {
  // Pirma ištrinam reviews
  await sql`
    DELETE FROM reviews WHERE tour_id = ${tourId}
  `;

  // Tada ištrinam tour_dates
  await sql`
    DELETE FROM tour_dates WHERE tour_id = ${tourId}
  `;

  // Tada trinam patį turą
  const result = await sql`
    DELETE FROM tours WHERE id = ${tourId}
    RETURNING *
  `;

  if (result.length === 0) {
    throw new Error(`Ekskursija su ID ${tourId} nerasta.`);
  }

  return result[0];
};





exports.getAllToursModel = async () => {
  const tours = await sql`
    SELECT 
      tours.id,
      tours.title,
      tours.image,
      tours.description,
      tours.location,
      tours.category_id,
      tours.user_id,
      tours.duration,
      tours.price,
      tours.rating,
      tours.created_at,
      categories.name AS category_name,
      COALESCE(
        json_agg(
          json_build_object('id', tour_dates.id, 'date_time', tour_dates.date_time)
        ) FILTER (WHERE tour_dates.id IS NOT NULL), '[]'
      ) AS dates
    FROM tours
    JOIN categories ON tours.category_id = categories.id
    LEFT JOIN tour_dates ON tours.id = tour_dates.tour_id
    GROUP BY 
      tours.id,
      tours.title,
      tours.image,
      tours.description,
      tours.location,
      tours.category_id,
      tours.user_id,
      tours.duration,
      tours.price,
      tours.rating,
      tours.created_at,
      categories.name
  `;
  return tours;
};

exports.getTourByIdModel = async (id) => {
  const tour = await sql`
    SELECT 
      tours.id,
      tours.title,
      tours.image,
      tours.description,
      tours.location,
      tours.category_id,
      tours.user_id,
      tours.duration,
      tours.price,
      tours.rating,
      tours.created_at,
      categories.name AS category_name,
      COALESCE(
        json_agg(
          json_build_object('id', tour_dates.id, 'date_time', tour_dates.date_time)
        ) FILTER (WHERE tour_dates.id IS NOT NULL), '[]'
      ) AS dates
    FROM tours
    JOIN categories ON tours.category_id = categories.id
    LEFT JOIN tour_dates ON tours.id = tour_dates.tour_id
    WHERE tours.id = ${id}
    GROUP BY 
      tours.id,
      tours.title,
      tours.image,
      tours.description,
      tours.location,
      tours.category_id,
      tours.user_id,
      tours.duration,
      tours.price,
      tours.rating,
      tours.created_at,
      categories.name
  `;
  return tour;
};

exports.filterTours = async (filter) => {
  try {
    const validDirections = ['ASC', 'DESC'];
    const validSortFields = ['title', 'rating'];

    const sortDirection = validDirections.includes(filter.sort_direction?.toUpperCase())
      ? filter.sort_direction.toUpperCase()
      : 'ASC';

    const sortField = validSortFields.includes(filter.sort_field)
      ? filter.sort_field
      : 'title';

    const limit = parseInt(filter.limit) || 10;
    const offset = parseInt(filter.page) > 1 ? (parseInt(filter.page) - 1) * limit : 0;

    const safeSearch = filter.search ? filter.search.replace(/'/g, "''") : null;

    const searchCondition = safeSearch
      ? `AND (
            tours.title ILIKE '%${safeSearch}%' OR
            EXISTS (
              SELECT 1 FROM tour_dates 
              WHERE tour_dates.tour_id = tours.id 
              AND CAST(tour_dates.date_time AS TEXT) ILIKE '%${safeSearch}%'
            )
         )`
      : '';

    const categoryCondition = filter.category
      ? `AND categories.name = '${filter.category.replace(/'/g, "''")}'`
      : '';

    const whereClause = `
      WHERE 1=1
      ${searchCondition}
      ${categoryCondition}
    `;

    // 👇 Pagrindinis SELECT su limit + offset
    const query = `
      SELECT 
        tours.id,
        tours.title,
        tours.image,
        tours.description,
        tours.location,
        tours.category_id,
        tours.user_id,
        tours.duration,
        tours.price,
        tours.rating,
        tours.created_at,
        categories.name AS category_name,
        COALESCE(
          json_agg(
            json_build_object('id', tour_dates.id, 'date_time', tour_dates.date_time)
          ) FILTER (WHERE tour_dates.id IS NOT NULL), '[]'
        ) AS dates
      FROM tours
      JOIN categories ON tours.category_id = categories.id
      LEFT JOIN tour_dates ON tours.id = tour_dates.tour_id
      ${whereClause}
      GROUP BY tours.id, categories.name
      ORDER BY tours.${sortField} ${sortDirection}
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT tours.id) AS total
      FROM tours
      JOIN categories ON tours.category_id = categories.id
      LEFT JOIN tour_dates ON tours.id = tour_dates.tour_id
      ${whereClause}
    `;

    const [tours, countResult] = await Promise.all([
      sql.unsafe(query),
      sql.unsafe(countQuery)
    ]);

    const total = countResult[0]?.total || 0;

    return { tours, total };

  } catch (error) {
    console.error('Error in filterTours:', error);
    throw error;
  }
};








