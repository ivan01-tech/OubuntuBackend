/* eslint-disable no-param-reassign */
import bcrypt from 'bcrypt';
import { ListActionResponse, RecordActionResponse, ResourceWithOptions } from 'adminjs';

import User from '../models/userModel.js';

export const userResource: ResourceWithOptions = {
  resource: User,
  options: {
    actions: {
      new: {
        before: async (request) => {
          const { password } = request.payload;
          console.log('password : ', password);

          if (request.payload?.password) {
            const hashPassword = await bcrypt.hash(password, 10);

            request.payload.password = hashPassword;
          }
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
        after: async (response: RecordActionResponse) => {
          response.record.params.password = '';
          return response;
        },
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
          edit: true, // we only show it in the edit view
        },
      },
    },
  },
};
