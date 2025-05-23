import _ from "lodash";
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import BusinessesRepository from "../repositories/businesses.repository";
import Businesses from "../models/businesses.model";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { TCountAllArgs, TGetAllArgs, TGetAllBetweenCreatedAtArgs } from "../shared/types/service.type";
import { setUploadPath, uploadFile } from "../shared/helpers/upload.helper";

export default class BusinessesService {
  private repository: BusinessesRepository;

  constructor() {
    this.repository = new BusinessesRepository();
  };

  getAll = async (args?: TGetAllArgs): Promise<Businesses[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      exclude: ["deleted_at"]
    });

    return record;
  };

  getAllBetweenCreatedAt = async (args: TGetAllBetweenCreatedAtArgs): Promise<Businesses[]> => {
    const record = await this.repository.findAllBetweenCreatedAt({
      ...args,
      exclude: ["deleted_at"]
    });

    return record;
  };

  getById = async (id: number): Promise<Businesses> => {
    const record = await this.repository.findById({ id: id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByName = async (name: string): Promise<Businesses> => {
    const record = await this.repository.findByName({ name: name });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByApiKey = async (api_key: string): Promise<Businesses> => {
    const record = await this.repository.findByApiKey({ api_key: api_key });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: Businesses, file?: Express.Multer.File): Promise<Businesses> => {
    const uploadPath = setUploadPath(file, this.repository.logoPath);
    let record: Businesses;
    let newData = new Businesses(data);
    let option = {
      params: newData,
      exclude: ["deleted_at"]
    };

    if (data.id) {
      // Update
      option.params.logo_path = uploadPath || data.logo_path || ""
      record = await this.repository.update({
        id: data.id,
        ...option
      });
    } else {
      // Create
      option.params.logo_path = uploadPath;
      record = await this.repository.create(option);
    }

    if (!_.isUndefined(file) && record.logo_path) {
      uploadFile(record.logo_path, file);
    };

    return record;
  };

  delete = async (id: number): Promise<Businesses> => {
    return await this.repository.softDelete({ id: id });
  };

  deleteMany = async (ids: number[]): Promise<void> => {
    this.repository.softDeleteMany({ ids: ids });
  };

  count = async (args: TCountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};