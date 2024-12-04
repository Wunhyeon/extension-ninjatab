export type IconProps = {
  className?: string; // Optional className prop
  strokeWidth?: number; // Optional strokeWidth prop
  strokeColor?: string; // Optional stroke color prop
};

export type UserEmailWithSubsriptionStatus = {
  email: string;
  subscriptions: {
    status: string;
    created_at: string;
  }[];
};
