import express from "express";

declare global {
  namespace Express {
    export interface User {
      studio: {
        license: string;
        name: string;
        specialty: string;
      };
      type: "individual" | "company";
      country: string;
      id: string;
      email: string;
      password: string;
      created: Date;
      firstName: string;
      lastName: string;
      stripeAccountId: string;

      // MongoDB methods
      isModified: (field: string) => boolean;
      isNew: boolean;
      generateHash: (password: string) => string;
      save: () => Promise<Express.User>;
      set: (body: Record<string, string>) => void;
    }
    export interface Request {
      body: Record<string, string>;
      user?: User;
    }
  }
}
