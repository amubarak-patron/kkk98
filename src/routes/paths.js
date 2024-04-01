// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/login`,
      register: `${ROOTS.AUTH}/register`,
      forgotPassword: `${ROOTS.AUTH}/reset_password`,
      OTP: `${ROOTS.AUTH}/OTP`,


    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    settings: `${ROOTS.DASHBOARD}/settings`,
    services: {
      root: `${ROOTS.DASHBOARD}/services`,
      form: (id) => `${ROOTS.DASHBOARD}/services/${id}`,
      clinicRegistration: `${ROOTS.DASHBOARD}/services/clinic-registration`
    },
    clinic: {
      root: `${ROOTS.DASHBOARD}/my-clinic`,
      applications: `${ROOTS.DASHBOARD}/my-clinic/applications`,
      services: {
        root: `${ROOTS.DASHBOARD}/my-clinic/services`,
        form: (id) => `${ROOTS.DASHBOARD}/my-clinic/services/${id}`,
      },

    },
  },
};
