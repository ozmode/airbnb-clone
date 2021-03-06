import { User } from "../../../entity/User";
import { MutationRegisterArgs } from "../../../types/graphql";
import { ResolverMap } from "../../../types/graphql-utils";
import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { formatYupError } from "../../../utils/formatYupError";
import { sendEmail } from "../../../utils/sendEmail";

import { userValidationSchema, duplicateEmail } from "@abb/common";

export const resolvers: ResolverMap = {
    Mutation: {
        register: async (_, args: MutationRegisterArgs, { redis, url }) => {
            try {
                await userValidationSchema.validate(args, {
                    abortEarly: false
                });
            } catch (err) {
                return formatYupError(err);
            }

            const { email, password } = args;

            const userAlreadyExists = await User.findOne({
                where: { email },
                select: ["id"]
            });

            if (userAlreadyExists) {
                return [
                    {
                        path: "email",
                        message: duplicateEmail
                    }
                ];
            }

            const user = User.create({
                email,
                password
            });
            await user.save();

            const confirmLink = await createConfirmEmailLink(
                url,
                user.id,
                redis
            );

            if (process.env.NODE_ENV !== "test")
                await sendEmail(
                    "Confirm Email",
                    email,
                    `Click <a href=${confirmLink}>here</a> to confirm your email for AirBNB`
                );

            return null;
        }
    }
};
