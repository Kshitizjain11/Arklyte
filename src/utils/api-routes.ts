const baseRoute = `${process.env.NEXT_PUBLIC_DOMAIN}/api`
export const Admin_Api_Routes = {
    LOGIN:`${baseRoute}/admin/login`,
    CREATE_JOB:`${baseRoute}/admin/create-job`,
    JOB_DETAILS:`${baseRoute}/admin/job-details`,

}

export const User_Api_Routes = {
    GET_ALL_TRIPS : `${baseRoute}/all-trips`,
    GET_CITY_TRIPS : `${baseRoute}/city-trips`,
    GET_TRIP_DATA : `${baseRoute}/trips`,
    LOGIN : `${baseRoute}/auth/login`,
    SIGNUP : `${baseRoute}/auth/signup`,
    ME: `${baseRoute}/auth/me`,
}