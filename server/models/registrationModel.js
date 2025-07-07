const { sql } = require("../dbConnection");

exports.createRegistrationModel = async (registrationData) => {
  const { procedure_date_id, user_id } = registrationData;
  const registration = await sql`
    INSERT INTO registrations (procedure_date_id, user_id)
    VALUES (${procedure_date_id}, ${user_id})
    RETURNING *;
  `;
  return registration[0];
};

exports.getAllRegistrationsModel = async () => {
  const registrations = await sql`
    SELECT 
      registrations.id AS registration_id,
      registrations.user_id AS user_id,
      registrations.procedure_date_id AS procedure_date_id,
      registrations.status AS registration_status,
      registrations.registered_at AS registration_date,
      users.name AS user_name,
      users.email AS user_email,
      procedures.id AS procedure_id,
      procedures.title AS procedure_title,
      procedures.location AS procedure_location,
      procedures.price AS procedure_price,
      procedure_dates.date_time AS procedure_date_time,
      categories.name AS category_name
    FROM registrations
    INNER JOIN users ON registrations.user_id = users.id
    INNER JOIN procedure_dates ON registrations.procedure_date_id = procedure_dates.id
    INNER JOIN procedures ON procedure_dates.procedure_id = procedures.id
    LEFT JOIN categories ON procedures.category_id = categories.id
    ORDER BY registrations.registered_at DESC;
  `;
  return registrations;
};

exports.getUserRegistrationsModel = async (userId) => {
  const registrations = await sql`
    SELECT 
      registrations.id AS registration_id,
      registrations.registered_at,
      registrations.status,
      procedures.title,
      procedures.id AS procedure_id,
      procedures.image,
      procedures.location,
      procedure_dates.date_time
    FROM registrations
    LEFT JOIN procedure_dates ON registrations.procedure_date_id = procedure_dates.id
    LEFT JOIN procedures ON procedure_dates.procedure_id = procedures.id
    WHERE registrations.user_id = ${userId}
    ORDER BY procedure_dates.date_time ASC;
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


exports.checkProcedureDateExists = async (procedureDateId) => {
  const result = await sql`
    SELECT * FROM procedure_dates
    WHERE id = ${procedureDateId}
  `;
  return result.length > 0;
};


exports.updateRegistrationDate = async (id, procedureDateId) => {
  const result = await sql`
    UPDATE registrations
    SET procedure_date_id = ${procedureDateId}
    WHERE id = ${id}
    RETURNING *;
  `;
  return result[0];
};


exports.getUserRegistrationDateModel = async (id, userId) => {
  const result = await sql`
    SELECT 
      procedure_dates.id AS id,
      procedure_dates.date_time AS date_time
    FROM procedure_dates
    WHERE procedure_dates.procedure_id = (
      SELECT procedure_id 
      FROM registrations
      LEFT JOIN procedure_dates ON registrations.procedure_date_id = procedure_dates.id
      WHERE registrations.id = ${id} AND registrations.user_id = ${userId}
    )
    ORDER BY procedure_dates.date_time ASC;
  `;
  return result;
};
