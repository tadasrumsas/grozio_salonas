const { sql } = require('../dbConnection');

exports.createRegistrationModel = async (registrationData) => {
  const { tour_date_id, user_id } = registrationData;
  const registration = await sql`
    INSERT INTO registrations (tour_date_id, user_id)
    VALUES (${tour_date_id}, ${user_id})
    RETURNING *;
  `;
  return registration[0];
};

exports.getAllRegistrationsModel = async () => {
  const registrations = await sql`
    SELECT 
      registrations.id AS registration_id,
      registrations.user_id AS user_id,
      registrations.tour_date_id AS tour_date_id,
      registrations.status AS registration_status,
      registrations.registered_at AS registration_date,
      users.name AS user_name,
      users.email AS user_email,
      tours.id AS tour_id,
      tours.title AS tour_title,
      tours.location AS tour_location,
      tours.price AS tour_price,
      tour_dates.date_time AS tour_date_time,
      categories.name AS category_name
    FROM registrations
    INNER JOIN users ON registrations.user_id = users.id
    INNER JOIN tour_dates ON registrations.tour_date_id = tour_dates.id
    INNER JOIN tours ON tour_dates.tour_id = tours.id
    LEFT JOIN categories ON tours.category_id = categories.id
    ORDER BY registrations.registered_at DESC;
  `;
  return registrations;
};

// Gauna visas registracijas su ekskursijos informacija
exports.getUserRegistrationsModel = async (userId) => {
  const registrations = await sql`
    SELECT 
      registrations.id AS registration_id,
      registrations.registered_at,
      registrations.status,
      tours.title,
      tours.id AS tour_id,
      tours.image,
      tours.location,
      tour_dates.date_time
    FROM registrations
    LEFT JOIN tour_dates ON registrations.tour_date_id = tour_dates.id
    LEFT JOIN tours ON tour_dates.tour_id = tours.id
    WHERE registrations.user_id = ${userId}
    ORDER BY tour_dates.date_time ASC;
  `;
  return registrations;
};

exports.updateRegistrationModel = async (id, registrationData) => {
  const { status } = registrationData;
  const updatedRegistration = await sql` 
    UPDATE registrations
    SET status = ${status}
    WHERE id = ${id}
    RETURNING *;
  `;
  return updatedRegistration[0];
};

exports.getUserRegistrationById = async (id, userId) => {
  const result = await sql`
    SELECT * FROM registrations
    WHERE id = ${id} AND user_id = ${userId}
  `;
  return result[0];
};

// Patikrinam ar nauja tour_date_id egzistuoja
exports.checkTourDateExists = async (tourDateId) => {
  const result = await sql`
    SELECT * FROM tour_dates
    WHERE id = ${tourDateId}
  `;
  return result.length > 0;
};

// Atnaujinam registracijos datą
exports.updateRegistrationDate = async (id, tourDateId) => {
  const result = await sql`
    UPDATE registrations
    SET tour_date_id = ${tourDateId}
    WHERE id = ${id}
    RETURNING *;
  `;
  return result[0];
};

// Gauti registracijos informaciją su data pagal ID ir naudotoją
exports.getUserRegistrationDateModel = async (id, userId) => {
  const result = await sql`
    SELECT 
      tour_dates.id AS id,
      tour_dates.date_time AS date_time
    FROM tour_dates
    WHERE tour_dates.tour_id = (
      SELECT tour_id 
      FROM registrations
      LEFT JOIN tour_dates ON registrations.tour_date_id = tour_dates.id
      WHERE registrations.id = ${id} AND registrations.user_id = ${userId}
    )
    ORDER BY tour_dates.date_time ASC;
  `;
  return result;
};



