export const schemaOptions = {
  id: false,
  timestamps: true,
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
  collation: { locale: 'en' },
};
