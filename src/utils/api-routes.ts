const baseRoute = `${process.env.NEXT_PUBLIC_DOMAIN}/api`
export const Admin_Api_Routes = {
    LOGIN:`${baseRoute}/admin/login`,
    CREATE_JOB:`${baseRoute}/admin/create-job`,
    JOB_DETAILS:`${baseRoute}/admin/job-details`,

}