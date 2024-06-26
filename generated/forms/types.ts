import typia, { tags } from "typia";
export enum question {
    multiple_choice,
    checkboxes,
    paragraph,
    sentance,
    essay,
    scale
}
export namespace form_info {
    export type base_question<T extends number & tags.Type<"uint32">> = {
        description?: string & tags.MaxLength<940>;
        name: string & tags.MaxLength<20>;
        answers: Map<number & tags.Type<"uint32">, boolean>;
        type: T;
    };
    export type scale_question = {
        high_end_text?: string & tags.MaxLength<20>;
        low_end_text?: string & tags.MaxLength<20>;
        description?: string & tags.MaxLength<940>;
        name: string & tags.MaxLength<20>;
        type: question.scale;
    };
    export type multiple_choice_question = base_question<question.multiple_choice> & {
        answer_names: Array<string & tags.MaxLength<20>>;
    };
    export type checkboxes_question = base_question<question.checkboxes> & {
        answer_names: Array<string & tags.MaxLength<20>>;
        need_all_valid_boxes_to_be_checked: boolean;
    };
    // assuming average word length is 4.7 characters
    export type essay_question = {
        placeholder?: string & tags.MaxLength<3055>;
        description?: string & tags.MaxLength<940>;
        name: string & tags.MaxLength<20>;
        type: question.essay;
    };
    export type paragraph_question = {
        placeholder?: string & tags.MaxLength<940>;
        description?: string & tags.MaxLength<940>;
        name: string & tags.MaxLength<20>;
        type: question.paragraph;
    };
    export type sentance_question = {
        placeholder?: string & tags.MaxLength<94>;
        description?: string & tags.MaxLength<940>;
        name: string & tags.MaxLength<20>;
        type: question.sentance;
    };
    export type merged_question = {
        answers?: Map<number & tags.Type<"uint32">, boolean>;
        answer_names?: (string & tags.MaxLength<20>)[];
        need_all_valid_boxes_to_be_checked?: boolean;
        placeholder?: string & tags.MaxLength<3055>;
        high_end_text?: string & tags.MaxLength<20>;
        description?: string & tags.MaxLength<940>;
        low_end_text?: string & tags.MaxLength<20>;
        name: string & tags.MaxLength<20>;
        type: number & tags.Type<"uint32">;
    };
    export interface form {
        delete_after_x_days: number & tags.Type<"uint32">;
        min_score_to_pass: number & tags.Type<"uint32">;
        can_only_have_one_application_pending: boolean;
        cooldown_days: number & tags.Type<"uint32">;
        minimum_rank: number & tags.Type<"uint32">;
        maximum_rank: number & tags.Type<"uint32">;
        description?: string & tags.MaxLength<940>;
        name: string & tags.MaxLength<20>;
        id: string & tags.Format<"uuid">;
        can_only_apply_once: boolean;
        questions: merged_question[];
        can_apply_in_game: boolean;
        requires_discord: boolean;
        auto_grade: boolean;
    }
}
export namespace form_submission {
    export type scale_question = {
        answer: number & tags.ExclusiveMaximum<10> & tags.ExclusiveMinimum<1> & tags.Type<"uint32">;
        type: question.scale & tags.Type<"uint32">;
    };
    export type multiple_choice_question = {
        answer: number & tags.Type<"uint32">;
        type: question.multiple_choice & tags.Type<"uint32">;
    };
    export type checkboxes_question = {
        answers: (number & tags.Type<"uint32">)[];
        type: question.checkboxes & tags.Type<"uint32">;
    };
    // assuming average word length is 4.7 characters
    export type essay_question = {
        answer: string & tags.MaxLength<3055>;
        type: question.essay & tags.Type<"uint32">;
    };
    export type paragraph_question = {
        answer: string & tags.MaxLength<940>;
        type: question.paragraph & tags.Type<"uint32">;
    };
    export type sentance_question = {
        answer: string & tags.MaxLength<94>;
        type: question.sentance & tags.Type<"uint32">;
    };
    export type merged_question = {
        answers?: (number & tags.Type<"uint32">)[];
        answer?: (string & tags.MaxLength<94>) | (string & tags.MaxLength<940>) | (string & tags.MaxLength<3055>) | (number & tags.Type<"uint32">) | (number & tags.ExclusiveMaximum<10> & tags.ExclusiveMinimum<1> & tags.Type<"uint32">);
        type: number & tags.Type<"uint32">;
    };
    export interface form_submission {
        id: string & tags.Format<"uuid">;
        answers: merged_question[];
        user_id: bigint;
    }
}
function create_question_validator<T>(question_type: question): (<U>(value: U & {
    type: question;
}) => ({
    success: true;
    data: T;
} | {
    success: false;
    data: null;
})) {
    return (value: any) => {
        if (value.type === question_type) {
            return { success: true, data: value };
        }
        else {
            return { success: false, data: null };
        }
    };
}
export const form_info = Object.freeze({
    write: (input: form_info.form): Uint8Array => {
        const $Sizer = (typia.protobuf.createEncode as any).Sizer;
        const $Writer = (typia.protobuf.createEncode as any).Writer;
        const encoder = (writer: any): any => {
            const $peo0 = (input: any): any => {
                // property "delete_after_x_days";
                writer.uint32(8);
                writer.uint32(input.delete_after_x_days);
                // property "min_score_to_pass";
                writer.uint32(16);
                writer.uint32(input.min_score_to_pass);
                // property "can_only_have_one_application_pending";
                writer.uint32(24);
                writer.bool(input.can_only_have_one_application_pending);
                // property "cooldown_days";
                writer.uint32(32);
                writer.uint32(input.cooldown_days);
                // property "minimum_rank";
                writer.uint32(40);
                writer.uint32(input.minimum_rank);
                // property "maximum_rank";
                writer.uint32(48);
                writer.uint32(input.maximum_rank);
                // property "description";
                if (undefined !== input.description) {
                    writer.uint32(58);
                    writer.string(input.description);
                }
                // property "name";
                writer.uint32(66);
                writer.string(input.name);
                // property "id";
                writer.uint32(74);
                writer.string(input.id);
                // property "can_only_apply_once";
                writer.uint32(80);
                writer.bool(input.can_only_apply_once);
                // property "questions";
                if (0 !== input.questions.length) {
                    for (const elem of input.questions) {
                        // 11 -> form_info.merged_question;
                        writer.uint32(90);
                        writer.fork();
                        $peo1(elem);
                        writer.ldelim();
                    }
                }
                // property "can_apply_in_game";
                writer.uint32(96);
                writer.bool(input.can_apply_in_game);
                // property "requires_discord";
                writer.uint32(104);
                writer.bool(input.requires_discord);
                // property "auto_grade";
                writer.uint32(112);
                writer.bool(input.auto_grade);
            };
            const $peo1 = (input: any): any => {
                // property "answers";
                if (undefined !== input.answers) {
                    for (const [key, value] of input.answers) {
                        writer.uint32(10);
                        writer.fork();
                        writer.uint32(8);
                        writer.uint32(key);
                        writer.uint32(16);
                        writer.bool(value);
                        writer.ldelim();
                    }
                }
                // property "answer_names";
                if (undefined !== input.answer_names) {
                    if (0 !== input.answer_names.length) {
                        for (const elem of input.answer_names) {
                            writer.uint32(18);
                            writer.string(elem);
                        }
                    }
                }
                // property "need_all_valid_boxes_to_be_checked";
                if (undefined !== input.need_all_valid_boxes_to_be_checked) {
                    writer.uint32(24);
                    writer.bool(input.need_all_valid_boxes_to_be_checked);
                }
                // property "placeholder";
                if (undefined !== input.placeholder) {
                    writer.uint32(34);
                    writer.string(input.placeholder);
                }
                // property "high_end_text";
                if (undefined !== input.high_end_text) {
                    writer.uint32(42);
                    writer.string(input.high_end_text);
                }
                // property "description";
                if (undefined !== input.description) {
                    writer.uint32(50);
                    writer.string(input.description);
                }
                // property "low_end_text";
                if (undefined !== input.low_end_text) {
                    writer.uint32(58);
                    writer.string(input.low_end_text);
                }
                // property "name";
                writer.uint32(66);
                writer.string(input.name);
                // property "type";
                writer.uint32(72);
                writer.uint32(input.type);
            };
            const $io1 = (input: any): boolean => (undefined === input.answers || input.answers instanceof Map && (() => [...input.answers].every((elem: any) => Array.isArray(elem) && (elem.length === 2 && ("number" === typeof elem[0] && (Math.floor(elem[0]) === elem[0] && 0 <= elem[0] && elem[0] <= 4294967295)) && "boolean" === typeof elem[1])))()) && (undefined === input.answer_names || Array.isArray(input.answer_names) && input.answer_names.every((elem: any) => "string" === typeof elem && elem.length <= 20)) && (undefined === input.need_all_valid_boxes_to_be_checked || "boolean" === typeof input.need_all_valid_boxes_to_be_checked) && (undefined === input.placeholder || "string" === typeof input.placeholder && input.placeholder.length <= 3055) && (undefined === input.high_end_text || "string" === typeof input.high_end_text && input.high_end_text.length <= 20) && (undefined === input.description || "string" === typeof input.description && input.description.length <= 940) && (undefined === input.low_end_text || "string" === typeof input.low_end_text && input.low_end_text.length <= 20) && ("string" === typeof input.name && input.name.length <= 20) && ("number" === typeof input.type && (Math.floor(input.type) === input.type && 0 <= input.type && input.type <= 4294967295));
            //form_info.form;
            $peo0(input);
            return writer;
        };
        const sizer = encoder(new $Sizer());
        const writer = encoder(new $Writer(sizer));
        return writer.buffer();
    },
    read: (input: Uint8Array, errorFactory: (p: import("typia").TypeGuardError.IProps) => Error = (() => new Error()) as any): import("typia").Resolved<form_info.form> => { const decode = (input: Uint8Array): import("typia").Resolved<form_info.form> => {
        const $Reader = (typia.protobuf.createAssertDecode as any).Reader;
        const $pdo0 = (reader: any, length: number = -1): any => {
            length = length < 0 ? reader.size() : reader.index() + length;
            const output = {
                delete_after_x_days: undefined as any,
                min_score_to_pass: undefined as any,
                can_only_have_one_application_pending: undefined as any,
                cooldown_days: undefined as any,
                minimum_rank: undefined as any,
                maximum_rank: undefined as any,
                description: undefined as any,
                name: "" as any,
                id: "" as any,
                can_only_apply_once: undefined as any,
                questions: [] as any,
                can_apply_in_game: undefined as any,
                requires_discord: undefined as any,
                auto_grade: undefined as any
            } as any;
            while (reader.index() < length) {
                const tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1:
                        // uint32;
                        output.delete_after_x_days = reader.uint32();
                        break;
                    case 2:
                        // uint32;
                        output.min_score_to_pass = reader.uint32();
                        break;
                    case 3:
                        // bool;
                        output.can_only_have_one_application_pending = reader.bool();
                        break;
                    case 4:
                        // uint32;
                        output.cooldown_days = reader.uint32();
                        break;
                    case 5:
                        // uint32;
                        output.minimum_rank = reader.uint32();
                        break;
                    case 6:
                        // uint32;
                        output.maximum_rank = reader.uint32();
                        break;
                    case 7:
                        // string;
                        output.description = reader.string();
                        break;
                    case 8:
                        // string;
                        output.name = reader.string();
                        break;
                    case 9:
                        // string;
                        output.id = reader.string();
                        break;
                    case 10:
                        // bool;
                        output.can_only_apply_once = reader.bool();
                        break;
                    case 11:
                        // type: Array<form_info.merged_question>;
                        output.questions.push($pdo1(reader, reader.uint32()));
                        break;
                    case 12:
                        // bool;
                        output.can_apply_in_game = reader.bool();
                        break;
                    case 13:
                        // bool;
                        output.requires_discord = reader.bool();
                        break;
                    case 14:
                        // bool;
                        output.auto_grade = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return output;
        };
        const $pdo1 = (reader: any, length: number = -1): any => {
            length = length < 0 ? reader.size() : reader.index() + length;
            const output = {
                answers: undefined as any,
                answer_names: undefined as any,
                need_all_valid_boxes_to_be_checked: undefined as any,
                placeholder: undefined as any,
                high_end_text: undefined as any,
                description: undefined as any,
                low_end_text: undefined as any,
                name: "" as any,
                type: undefined as any
            } as any;
            while (reader.index() < length) {
                const tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1:
                        // type: Map<string, boolean>;
                        (() => {
                            output.answers ??= new Map<any, any>();
                            const piece = reader.uint32() + reader.index();
                            const entry = {
                                key: undefined as any,
                                value: undefined as any
                            } as any;
                            while (reader.index() < piece) {
                                const kind = reader.uint32();
                                switch (kind >>> 3) {
                                    case 1:
                                        // uint32;
                                        entry.key = reader.uint32();
                                        break;
                                    case 2:
                                        // bool;
                                        entry.value = reader.bool();
                                        break;
                                    default:
                                        reader.skipType(kind & 7);
                                        break;
                                }
                            }
                            output.answers.set(entry.key, entry.value);
                        })();
                        break;
                    case 2:
                        // type: Array<(string & MaxLength<20>)>;
                        output.answer_names ??= [] as any[];
                        output.answer_names.push(reader.string());
                        break;
                    case 3:
                        // bool;
                        output.need_all_valid_boxes_to_be_checked = reader.bool();
                        break;
                    case 4:
                        // string;
                        output.placeholder = reader.string();
                        break;
                    case 5:
                        // string;
                        output.high_end_text = reader.string();
                        break;
                    case 6:
                        // string;
                        output.description = reader.string();
                        break;
                    case 7:
                        // string;
                        output.low_end_text = reader.string();
                        break;
                    case 8:
                        // string;
                        output.name = reader.string();
                        break;
                    case 9:
                        // uint32;
                        output.type = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return output;
        };
        const reader = new $Reader(input);
        return $pdo0(reader);
    }; const assert = (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): form_info.form => {
        const __is = (input: any): input is form_info.form => {
            const $io0 = (input: any): boolean => "number" === typeof input.delete_after_x_days && (Math.floor(input.delete_after_x_days) === input.delete_after_x_days && 0 <= input.delete_after_x_days && input.delete_after_x_days <= 4294967295) && ("number" === typeof input.min_score_to_pass && (Math.floor(input.min_score_to_pass) === input.min_score_to_pass && 0 <= input.min_score_to_pass && input.min_score_to_pass <= 4294967295)) && "boolean" === typeof input.can_only_have_one_application_pending && ("number" === typeof input.cooldown_days && (Math.floor(input.cooldown_days) === input.cooldown_days && 0 <= input.cooldown_days && input.cooldown_days <= 4294967295)) && ("number" === typeof input.minimum_rank && (Math.floor(input.minimum_rank) === input.minimum_rank && 0 <= input.minimum_rank && input.minimum_rank <= 4294967295)) && ("number" === typeof input.maximum_rank && (Math.floor(input.maximum_rank) === input.maximum_rank && 0 <= input.maximum_rank && input.maximum_rank <= 4294967295)) && (undefined === input.description || "string" === typeof input.description && input.description.length <= 940) && ("string" === typeof input.name && input.name.length <= 20) && ("string" === typeof input.id && /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.id)) && "boolean" === typeof input.can_only_apply_once && (Array.isArray(input.questions) && input.questions.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem))) && "boolean" === typeof input.can_apply_in_game && "boolean" === typeof input.requires_discord && "boolean" === typeof input.auto_grade;
            const $io1 = (input: any): boolean => (undefined === input.answers || input.answers instanceof Map && (() => [...input.answers].every((elem: any) => Array.isArray(elem) && (elem.length === 2 && ("number" === typeof elem[0] && (Math.floor(elem[0]) === elem[0] && 0 <= elem[0] && elem[0] <= 4294967295)) && "boolean" === typeof elem[1])))()) && (undefined === input.answer_names || Array.isArray(input.answer_names) && input.answer_names.every((elem: any) => "string" === typeof elem && elem.length <= 20)) && (undefined === input.need_all_valid_boxes_to_be_checked || "boolean" === typeof input.need_all_valid_boxes_to_be_checked) && (undefined === input.placeholder || "string" === typeof input.placeholder && input.placeholder.length <= 3055) && (undefined === input.high_end_text || "string" === typeof input.high_end_text && input.high_end_text.length <= 20) && (undefined === input.description || "string" === typeof input.description && input.description.length <= 940) && (undefined === input.low_end_text || "string" === typeof input.low_end_text && input.low_end_text.length <= 20) && ("string" === typeof input.name && input.name.length <= 20) && ("number" === typeof input.type && (Math.floor(input.type) === input.type && 0 <= input.type && input.type <= 4294967295));
            return "object" === typeof input && null !== input && $io0(input);
        };
        if (false === __is(input))
            ((input: any, _path: string, _exceptionable: boolean = true): input is form_info.form => {
                const $guard = (typia.protobuf.createAssertDecode as any).guard;
                const $ao0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.delete_after_x_days && (Math.floor(input.delete_after_x_days) === input.delete_after_x_days && 0 <= input.delete_after_x_days && input.delete_after_x_days <= 4294967295 || $guard(_exceptionable, {
                    path: _path + ".delete_after_x_days",
                    expected: "number & Type<\"uint32\">",
                    value: input.delete_after_x_days
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".delete_after_x_days",
                    expected: "(number & Type<\"uint32\">)",
                    value: input.delete_after_x_days
                }, errorFactory)) && ("number" === typeof input.min_score_to_pass && (Math.floor(input.min_score_to_pass) === input.min_score_to_pass && 0 <= input.min_score_to_pass && input.min_score_to_pass <= 4294967295 || $guard(_exceptionable, {
                    path: _path + ".min_score_to_pass",
                    expected: "number & Type<\"uint32\">",
                    value: input.min_score_to_pass
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".min_score_to_pass",
                    expected: "(number & Type<\"uint32\">)",
                    value: input.min_score_to_pass
                }, errorFactory)) && ("boolean" === typeof input.can_only_have_one_application_pending || $guard(_exceptionable, {
                    path: _path + ".can_only_have_one_application_pending",
                    expected: "boolean",
                    value: input.can_only_have_one_application_pending
                }, errorFactory)) && ("number" === typeof input.cooldown_days && (Math.floor(input.cooldown_days) === input.cooldown_days && 0 <= input.cooldown_days && input.cooldown_days <= 4294967295 || $guard(_exceptionable, {
                    path: _path + ".cooldown_days",
                    expected: "number & Type<\"uint32\">",
                    value: input.cooldown_days
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".cooldown_days",
                    expected: "(number & Type<\"uint32\">)",
                    value: input.cooldown_days
                }, errorFactory)) && ("number" === typeof input.minimum_rank && (Math.floor(input.minimum_rank) === input.minimum_rank && 0 <= input.minimum_rank && input.minimum_rank <= 4294967295 || $guard(_exceptionable, {
                    path: _path + ".minimum_rank",
                    expected: "number & Type<\"uint32\">",
                    value: input.minimum_rank
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".minimum_rank",
                    expected: "(number & Type<\"uint32\">)",
                    value: input.minimum_rank
                }, errorFactory)) && ("number" === typeof input.maximum_rank && (Math.floor(input.maximum_rank) === input.maximum_rank && 0 <= input.maximum_rank && input.maximum_rank <= 4294967295 || $guard(_exceptionable, {
                    path: _path + ".maximum_rank",
                    expected: "number & Type<\"uint32\">",
                    value: input.maximum_rank
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".maximum_rank",
                    expected: "(number & Type<\"uint32\">)",
                    value: input.maximum_rank
                }, errorFactory)) && (undefined === input.description || "string" === typeof input.description && (input.description.length <= 940 || $guard(_exceptionable, {
                    path: _path + ".description",
                    expected: "string & MaxLength<940>",
                    value: input.description
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".description",
                    expected: "((string & MaxLength<940>) | undefined)",
                    value: input.description
                }, errorFactory)) && ("string" === typeof input.name && (input.name.length <= 20 || $guard(_exceptionable, {
                    path: _path + ".name",
                    expected: "string & MaxLength<20>",
                    value: input.name
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".name",
                    expected: "(string & MaxLength<20>)",
                    value: input.name
                }, errorFactory)) && ("string" === typeof input.id && (/^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.id) || $guard(_exceptionable, {
                    path: _path + ".id",
                    expected: "string & Format<\"uuid\">",
                    value: input.id
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".id",
                    expected: "(string & Format<\"uuid\">)",
                    value: input.id
                }, errorFactory)) && ("boolean" === typeof input.can_only_apply_once || $guard(_exceptionable, {
                    path: _path + ".can_only_apply_once",
                    expected: "boolean",
                    value: input.can_only_apply_once
                }, errorFactory)) && ((Array.isArray(input.questions) || $guard(_exceptionable, {
                    path: _path + ".questions",
                    expected: "Array<form_info.merged_question>",
                    value: input.questions
                }, errorFactory)) && input.questions.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                    path: _path + ".questions[" + _index1 + "]",
                    expected: "form_info.merged_question",
                    value: elem
                }, errorFactory)) && $ao1(elem, _path + ".questions[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                    path: _path + ".questions[" + _index1 + "]",
                    expected: "form_info.merged_question",
                    value: elem
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".questions",
                    expected: "Array<form_info.merged_question>",
                    value: input.questions
                }, errorFactory)) && ("boolean" === typeof input.can_apply_in_game || $guard(_exceptionable, {
                    path: _path + ".can_apply_in_game",
                    expected: "boolean",
                    value: input.can_apply_in_game
                }, errorFactory)) && ("boolean" === typeof input.requires_discord || $guard(_exceptionable, {
                    path: _path + ".requires_discord",
                    expected: "boolean",
                    value: input.requires_discord
                }, errorFactory)) && ("boolean" === typeof input.auto_grade || $guard(_exceptionable, {
                    path: _path + ".auto_grade",
                    expected: "boolean",
                    value: input.auto_grade
                }, errorFactory));
                const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (undefined === input.answers || (input.answers instanceof Map || $guard(_exceptionable, {
                    path: _path + ".answers",
                    expected: "(Map<(number & Type<\"uint32\">), boolean> | undefined)",
                    value: input.answers
                }, errorFactory)) && (() => [...input.answers].every((elem: any, _index2: number) => (Array.isArray(elem) || $guard(_exceptionable, {
                    path: _path + ".answers[" + _index2 + "]",
                    expected: "[(number & Type<\"uint32\">), boolean]",
                    value: elem
                }, errorFactory)) && ((elem.length === 2 || $guard(_exceptionable, {
                    path: _path + ".answers[" + _index2 + "]",
                    expected: "[(number & Type<\"uint32\">), boolean]",
                    value: elem
                }, errorFactory)) && ("number" === typeof elem[0] && (Math.floor(elem[0]) === elem[0] && 0 <= elem[0] && elem[0] <= 4294967295 || $guard(_exceptionable, {
                    path: _path + ".answers[" + _index2 + "][0]",
                    expected: "number & Type<\"uint32\">",
                    value: elem[0]
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".answers[" + _index2 + "][0]",
                    expected: "(number & Type<\"uint32\">)",
                    value: elem[0]
                }, errorFactory)) && ("boolean" === typeof elem[1] || $guard(_exceptionable, {
                    path: _path + ".answers[" + _index2 + "][1]",
                    expected: "boolean",
                    value: elem[1]
                }, errorFactory))) || $guard(_exceptionable, {
                    path: _path + ".answers[" + _index2 + "]",
                    expected: "[(number & Type<\"uint32\">), boolean]",
                    value: elem
                }, errorFactory)))() || $guard(_exceptionable, {
                    path: _path + ".answers",
                    expected: "(Map<(number & Type<\"uint32\">), boolean> | undefined)",
                    value: input.answers
                }, errorFactory)) && (undefined === input.answer_names || (Array.isArray(input.answer_names) || $guard(_exceptionable, {
                    path: _path + ".answer_names",
                    expected: "(Array<string & MaxLength<20>> | undefined)",
                    value: input.answer_names
                }, errorFactory)) && input.answer_names.every((elem: any, _index3: number) => "string" === typeof elem && (elem.length <= 20 || $guard(_exceptionable, {
                    path: _path + ".answer_names[" + _index3 + "]",
                    expected: "string & MaxLength<20>",
                    value: elem
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".answer_names[" + _index3 + "]",
                    expected: "(string & MaxLength<20>)",
                    value: elem
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".answer_names",
                    expected: "(Array<string & MaxLength<20>> | undefined)",
                    value: input.answer_names
                }, errorFactory)) && (undefined === input.need_all_valid_boxes_to_be_checked || "boolean" === typeof input.need_all_valid_boxes_to_be_checked || $guard(_exceptionable, {
                    path: _path + ".need_all_valid_boxes_to_be_checked",
                    expected: "(boolean | undefined)",
                    value: input.need_all_valid_boxes_to_be_checked
                }, errorFactory)) && (undefined === input.placeholder || "string" === typeof input.placeholder && (input.placeholder.length <= 3055 || $guard(_exceptionable, {
                    path: _path + ".placeholder",
                    expected: "string & MaxLength<3055>",
                    value: input.placeholder
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".placeholder",
                    expected: "((string & MaxLength<3055>) | undefined)",
                    value: input.placeholder
                }, errorFactory)) && (undefined === input.high_end_text || "string" === typeof input.high_end_text && (input.high_end_text.length <= 20 || $guard(_exceptionable, {
                    path: _path + ".high_end_text",
                    expected: "string & MaxLength<20>",
                    value: input.high_end_text
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".high_end_text",
                    expected: "((string & MaxLength<20>) | undefined)",
                    value: input.high_end_text
                }, errorFactory)) && (undefined === input.description || "string" === typeof input.description && (input.description.length <= 940 || $guard(_exceptionable, {
                    path: _path + ".description",
                    expected: "string & MaxLength<940>",
                    value: input.description
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".description",
                    expected: "((string & MaxLength<940>) | undefined)",
                    value: input.description
                }, errorFactory)) && (undefined === input.low_end_text || "string" === typeof input.low_end_text && (input.low_end_text.length <= 20 || $guard(_exceptionable, {
                    path: _path + ".low_end_text",
                    expected: "string & MaxLength<20>",
                    value: input.low_end_text
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".low_end_text",
                    expected: "((string & MaxLength<20>) | undefined)",
                    value: input.low_end_text
                }, errorFactory)) && ("string" === typeof input.name && (input.name.length <= 20 || $guard(_exceptionable, {
                    path: _path + ".name",
                    expected: "string & MaxLength<20>",
                    value: input.name
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".name",
                    expected: "(string & MaxLength<20>)",
                    value: input.name
                }, errorFactory)) && ("number" === typeof input.type && (Math.floor(input.type) === input.type && 0 <= input.type && input.type <= 4294967295 || $guard(_exceptionable, {
                    path: _path + ".type",
                    expected: "number & Type<\"uint32\">",
                    value: input.type
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".type",
                    expected: "(number & Type<\"uint32\">)",
                    value: input.type
                }, errorFactory));
                return ("object" === typeof input && null !== input || $guard(true, {
                    path: _path + "",
                    expected: "form_info.form",
                    value: input
                }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                    path: _path + "",
                    expected: "form_info.form",
                    value: input
                }, errorFactory);
            })(input, "$input", true);
        return input;
    }; const output = decode(input); return assert(output, errorFactory) as any; },
    question: Object.freeze({
        is_multiple_choice: create_question_validator<form_info.multiple_choice_question>(question.multiple_choice),
        is_checkboxes: create_question_validator<form_info.checkboxes_question>(question.checkboxes),
        is_paragraph: create_question_validator<form_info.paragraph_question>(question.paragraph),
        is_sentance: create_question_validator<form_info.sentance_question>(question.sentance),
        is_scale: create_question_validator<form_info.scale_question>(question.scale),
        is_essay: create_question_validator<form_info.essay_question>(question.essay),
    }),
});
export const submission = Object.freeze({
    write: (input: form_submission.form_submission): Uint8Array => {
        const $throws = (typia.protobuf.createEncode as any).throws;
        const $Sizer = (typia.protobuf.createEncode as any).Sizer;
        const $Writer = (typia.protobuf.createEncode as any).Writer;
        const encoder = (writer: any): any => {
            const $peo0 = (input: any): any => {
                // property "id";
                writer.uint32(10);
                writer.string(input.id);
                // property "answers";
                if (0 !== input.answers.length) {
                    for (const elem of input.answers) {
                        // 2 -> form_submission.merged_question;
                        writer.uint32(18);
                        writer.fork();
                        $peo1(elem);
                        writer.ldelim();
                    }
                }
                // property "user_id";
                writer.uint32(24);
                writer.int64(input.user_id);
            };
            const $peo1 = (input: any): any => {
                // property "answers";
                if (undefined !== input.answers) {
                    if (0 !== input.answers.length) {
                        writer.uint32(10);
                        writer.fork();
                        for (const elem of input.answers) {
                            writer.uint32(elem);
                        }
                        writer.ldelim();
                    }
                }
                // property "answer";
                if (undefined !== input.answer) {
                    if ("number" === typeof input.answer) {
                        writer.uint32(16);
                        writer.uint32(input.answer);
                    }
                    else if ("string" === typeof input.answer) {
                        writer.uint32(26);
                        writer.string(input.answer);
                    }
                    else
                        $throws({
                            expected: "((number & (Type<\"uint32\"> | (ExclusiveMaximum<10> & ExclusiveMinimum<1> & Type<\"uint32\">))) | (string & (MaxLength<940> | MaxLength<3055> | MaxLength<94>)) | undefined)",
                            value: input.answer
                        });
                }
                // property "type";
                writer.uint32(32);
                writer.uint32(input.type);
            };
            const $io1 = (input: any): boolean => (undefined === input.answers || Array.isArray(input.answers) && input.answers.every((elem: any) => "number" === typeof elem && (Math.floor(elem) === elem && 0 <= elem && elem <= 4294967295))) && (undefined === input.answer || "number" === typeof input.answer && (Math.floor(input.answer) === input.answer && 0 <= input.answer && input.answer <= 4294967295 || input.answer < 10 && 1 < input.answer && (Math.floor(input.answer) === input.answer && 0 <= input.answer && input.answer <= 4294967295)) || "string" === typeof input.answer && (input.answer.length <= 940 || input.answer.length <= 3055 || input.answer.length <= 94)) && ("number" === typeof input.type && (Math.floor(input.type) === input.type && 0 <= input.type && input.type <= 4294967295));
            //form_submission.form_submission;
            $peo0(input);
            return writer;
        };
        const sizer = encoder(new $Sizer());
        const writer = encoder(new $Writer(sizer));
        return writer.buffer();
    },
    read: (input: Uint8Array, errorFactory: (p: import("typia").TypeGuardError.IProps) => Error = (() => new Error()) as any): import("typia").Resolved<form_submission.form_submission> => { const decode = (input: Uint8Array): import("typia").Resolved<form_submission.form_submission> => {
        const $Reader = (typia.protobuf.createAssertDecode as any).Reader;
        const $pdo0 = (reader: any, length: number = -1): any => {
            length = length < 0 ? reader.size() : reader.index() + length;
            const output = {
                id: "" as any,
                answers: [] as any,
                user_id: undefined as any
            } as any;
            while (reader.index() < length) {
                const tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1:
                        // string;
                        output.id = reader.string();
                        break;
                    case 2:
                        // type: Array<form_submission.merged_question>;
                        output.answers.push($pdo1(reader, reader.uint32()));
                        break;
                    case 3:
                        // int64;
                        output.user_id = reader.int64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return output;
        };
        const $pdo1 = (reader: any, length: number = -1): any => {
            length = length < 0 ? reader.size() : reader.index() + length;
            const output = {
                answers: undefined as any,
                answer: undefined as any,
                type: undefined as any
            } as any;
            while (reader.index() < length) {
                const tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1:
                        // type: Array<(number & Type<"uint32">)>;
                        output.answers ??= [] as any[];
                        if (2 === (tag & 7)) {
                            const piece = reader.uint32() + reader.index();
                            while (reader.index() < piece)
                                output.answers.push(reader.uint32());
                        }
                        else
                            output.answers.push(reader.uint32());
                        break;
                    case 2:
                        // uint32;
                        output.answer = reader.uint32();
                        break;
                    case 3:
                        // string;
                        output.answer = reader.string();
                        break;
                    case 4:
                        // uint32;
                        output.type = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return output;
        };
        const reader = new $Reader(input);
        return $pdo0(reader);
    }; const assert = (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): form_submission.form_submission => {
        const __is = (input: any): input is form_submission.form_submission => {
            const $io0 = (input: any): boolean => "string" === typeof input.id && /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.id) && (Array.isArray(input.answers) && input.answers.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem))) && "bigint" === typeof input.user_id;
            const $io1 = (input: any): boolean => (undefined === input.answers || Array.isArray(input.answers) && input.answers.every((elem: any) => "number" === typeof elem && (Math.floor(elem) === elem && 0 <= elem && elem <= 4294967295))) && (undefined === input.answer || "number" === typeof input.answer && (Math.floor(input.answer) === input.answer && 0 <= input.answer && input.answer <= 4294967295 || input.answer < 10 && 1 < input.answer && (Math.floor(input.answer) === input.answer && 0 <= input.answer && input.answer <= 4294967295)) || "string" === typeof input.answer && (input.answer.length <= 940 || input.answer.length <= 3055 || input.answer.length <= 94)) && ("number" === typeof input.type && (Math.floor(input.type) === input.type && 0 <= input.type && input.type <= 4294967295));
            return "object" === typeof input && null !== input && $io0(input);
        };
        if (false === __is(input))
            ((input: any, _path: string, _exceptionable: boolean = true): input is form_submission.form_submission => {
                const $guard = (typia.protobuf.createAssertDecode as any).guard;
                const $ao0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (/^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.id) || $guard(_exceptionable, {
                    path: _path + ".id",
                    expected: "string & Format<\"uuid\">",
                    value: input.id
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".id",
                    expected: "(string & Format<\"uuid\">)",
                    value: input.id
                }, errorFactory)) && ((Array.isArray(input.answers) || $guard(_exceptionable, {
                    path: _path + ".answers",
                    expected: "Array<form_submission.merged_question>",
                    value: input.answers
                }, errorFactory)) && input.answers.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                    path: _path + ".answers[" + _index1 + "]",
                    expected: "form_submission.merged_question",
                    value: elem
                }, errorFactory)) && $ao1(elem, _path + ".answers[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                    path: _path + ".answers[" + _index1 + "]",
                    expected: "form_submission.merged_question",
                    value: elem
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".answers",
                    expected: "Array<form_submission.merged_question>",
                    value: input.answers
                }, errorFactory)) && ("bigint" === typeof input.user_id || $guard(_exceptionable, {
                    path: _path + ".user_id",
                    expected: "bigint",
                    value: input.user_id
                }, errorFactory));
                const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (undefined === input.answers || (Array.isArray(input.answers) || $guard(_exceptionable, {
                    path: _path + ".answers",
                    expected: "(Array<number & Type<\"uint32\">> | undefined)",
                    value: input.answers
                }, errorFactory)) && input.answers.every((elem: any, _index2: number) => "number" === typeof elem && (Math.floor(elem) === elem && 0 <= elem && elem <= 4294967295 || $guard(_exceptionable, {
                    path: _path + ".answers[" + _index2 + "]",
                    expected: "number & Type<\"uint32\">",
                    value: elem
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".answers[" + _index2 + "]",
                    expected: "(number & Type<\"uint32\">)",
                    value: elem
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".answers",
                    expected: "(Array<number & Type<\"uint32\">> | undefined)",
                    value: input.answers
                }, errorFactory)) && (undefined === input.answer || "number" === typeof input.answer && (Math.floor(input.answer) === input.answer && 0 <= input.answer && input.answer <= 4294967295 || input.answer < 10 && 1 < input.answer && (Math.floor(input.answer) === input.answer && 0 <= input.answer && input.answer <= 4294967295) || $guard(_exceptionable, {
                    path: _path + ".answer",
                    expected: "(number & (Type<\"uint32\"> | (ExclusiveMaximum<10> & ExclusiveMinimum<1> & Type<\"uint32\">)))",
                    value: input.answer
                }, errorFactory)) || "string" === typeof input.answer && (input.answer.length <= 940 || input.answer.length <= 3055 || input.answer.length <= 94 || $guard(_exceptionable, {
                    path: _path + ".answer",
                    expected: "(string & (MaxLength<940> | MaxLength<3055> | MaxLength<94>))",
                    value: input.answer
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".answer",
                    expected: "((number & (Type<\"uint32\"> | (ExclusiveMaximum<10> & ExclusiveMinimum<1> & Type<\"uint32\">))) | (string & (MaxLength<940> | MaxLength<3055> | MaxLength<94>)) | undefined)",
                    value: input.answer
                }, errorFactory)) && ("number" === typeof input.type && (Math.floor(input.type) === input.type && 0 <= input.type && input.type <= 4294967295 || $guard(_exceptionable, {
                    path: _path + ".type",
                    expected: "number & Type<\"uint32\">",
                    value: input.type
                }, errorFactory)) || $guard(_exceptionable, {
                    path: _path + ".type",
                    expected: "(number & Type<\"uint32\">)",
                    value: input.type
                }, errorFactory));
                return ("object" === typeof input && null !== input || $guard(true, {
                    path: _path + "",
                    expected: "form_submission.form_submission",
                    value: input
                }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                    path: _path + "",
                    expected: "form_submission.form_submission",
                    value: input
                }, errorFactory);
            })(input, "$input", true);
        return input;
    }; const output = decode(input); return assert(output, errorFactory) as any; },
    question: (form_info.question as unknown) as Readonly<{
        is_multiple_choice: typeof create_question_validator<form_submission.multiple_choice_question>;
        is_checkboxes: typeof create_question_validator<form_submission.checkboxes_question>;
        is_paragraph: typeof create_question_validator<form_submission.paragraph_question>;
        is_sentance: typeof create_question_validator<form_submission.sentance_question>;
        is_scale: typeof create_question_validator<form_submission.scale_question>;
        is_essay: typeof create_question_validator<form_submission.essay_question>;
    }>
});
