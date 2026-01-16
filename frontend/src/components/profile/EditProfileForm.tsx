import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

interface FormFieldProps {
  id: string;
  label: string;
  icon: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, icon, type = 'text', value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1" htmlFor={id}>
      {label}
    </label>
    <div className="relative group">
      <Icon name={icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]" />
      <input
        className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-semibold outline-none"
        id={id}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

const EditProfileForm: React.FC<{ onSave: () => void }> = ({ onSave }) => {
  const [formData, setFormData] = React.useState({
    fullName: 'Aarya Sharma',
    username: 'storyteller_aarya',
    email: 'aarya.sharma@katha.app',
    bio: 'Explaining myths through modern eyes. ✨ Keeper of tales.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/5 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <FormField id="fullName" label="Full Name" icon="badge" value={formData.fullName} onChange={handleChange} />
      <FormField id="username" label="Username" icon="alternate_email" value={formData.username} onChange={handleChange} />
      <FormField id="email" label="Email" icon="mail" type="email" value={formData.email} onChange={handleChange} />
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1" htmlFor="bio">
          Bio
        </label>
        <textarea
          className="w-full p-4 rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-medium resize-none outline-none"
          id="bio"
          rows={3}
          value={formData.bio}
          onChange={handleChange}
        ></textarea>
      </div>
      <button
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-amber-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 hover:shadow-xl hover:shadow-primary/30"
        type="submit"
      >
        <Icon name="check_circle" className="text-[20px]" />
        Save Changes
      </button>
    </motion.form>
  );
};

export default EditProfileForm;
