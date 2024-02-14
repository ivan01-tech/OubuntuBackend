/* eslint-disable no-param-reassign */
import bcrypt from 'bcrypt';
import { ListActionResponse, RecordActionResponse, ResourceWithOptions } from 'adminjs';
import passwordsFeature from '@adminjs/passwords';

import User from '../models/userModel.js';
import componentLoader from '../admin/component-loader.js';
import { SALT_HASH } from '../constants.js';

export const userResource: ResourceWithOptions = {
  resource: User,
  features: [
    passwordsFeature({
      properties: { encryptedPassword: 'password' },
      hash: async (pass) => {
        const res = await bcrypt.hash(pass, SALT_HASH);
        const matchPassword = await bcrypt.compare(pass, res);
        console.log('matchPassword : ', matchPassword);
        return res;
      },
      componentLoader,
    }),
  ],
  options: {
    actions: {
      new: {
        before: async (request) => {
          const { password } = request.payload;
          console.log('request to', request.payload);

          return request;
        },
        after: async (request) => {
          console.log('request to', request.payload);
          // if (password) {
          //   const saltRounds = 10; // Adjust salt rounds as needed
          //   const hashedPassword = await bcrypt.hash(password, saltRounds);
          //   request.payload.password = hashedPassword;
          // }

          return request;
        },
      },
      show: {
        after: async (response: RecordActionResponse) =>
          //   response.record.params.password = '';
          // eslint-disable-next-line implicit-arrow-linebreak
          response,
      },
      edit: {
        before: async (request) => {
          // no need to hash on GET requests, we'll remove passwords there anyway
          if (request.method === 'post') {
            const { password } = request.payload;

            // hash only if password is present, delete otherwise
            // so we don't overwrite it
            if (password) {
              const hashPassword = await bcrypt.hash(password, 10);

              request.payload.password = hashPassword;
            } else {
              delete request.payload?.password;
            }
          }
          return request;
        },
        after: async (response: RecordActionResponse) => response,
      },
      list: {
        after: async (response: ListActionResponse) => {
          response.records.forEach((record) => {
            // record.params.password = '';
          });
          return response;
        },
      },
    },
    properties: {
      password: {
        isVisible: {
          list: true,
          filter: true,
          show: true,
          edit: true,
        },
        type: 'string',
      },
    },
  },
};
