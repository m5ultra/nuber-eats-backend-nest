// export interface MailModuleOptions {
//   apiKey: string
//   domain: string
//   fromEmail: string
// }
//
// export interface EmailVar {
//   key: string
//   value: string
// }

export interface MailModuleOptions {
  formEmail: string
  code: string
}

export interface ISendEmailOptions {
  email: string
  subject?: string
  code: string
  sign?: string
}
