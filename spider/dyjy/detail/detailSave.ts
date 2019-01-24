import DetailSpider from "./detail";
import { findOneByID } from "../../../server/mongodb/queryUtils";
import { MoviesDB, MovieModel } from "./detailCon";
import { StatusBean } from "../../typings/status";
import { IDetails } from "../../typings/detailResponse";

const SaveDetail = (id: string, resolve: any) => {
  const detailSpider = new DetailSpider();
  const status = new StatusBean();
  try {
    detailSpider.getDatail(id, (detail: IDetails) => {
      if (detail) {
        findOneByID(id, (detailFromDB: any) => {
          if (detailFromDB === 0) {
            MovieModel(MoviesDB()).create(detail, function (error: any) {
              if (error) {
                status.code = StatusBean.FAILED_NEED_REPEAT;
                status.error = ("SaveDetail>>>" + id + " " + detail.name + ">>>保存失败");
                resolve(status);
              } else {
                status.code = StatusBean.SUCCESS;
                status.error = ("SaveDetail>>>" + id + " " + detail.name + ">>>保存成功");
                resolve(status);
              }
            });
          } else if (JSON.stringify(detail.files) === JSON.stringify(detailFromDB.files)) {
            MovieModel(MoviesDB()).update({ id: id }, { $set: detail }, (err: any) => {
              if (err) {
                status.code = StatusBean.FAILED_NEED_REPEAT;
                status.error = ("SaveDetail>>>" + id + " " + detail.name + ">>>更新失败");
                resolve(status);
              } else {
                status.code = StatusBean.SUCCESS;
                status.error = ("SaveDetail>>>" + id + " " + detail.name + ">>>更新成功");
                resolve(status);
              }
            });
          } else {
            status.code = StatusBean.SUCCESS;
            status.error = ("SaveDetail>>>" + id + " " + detail.name + ">>>无需更新");
            resolve(status);
          }
        });
      } else {
        status.code = StatusBean.SUCCESS;
        status.error = ("SaveDetail>>>" + id + ">>>不存在");
        resolve(status);
      }
    });
  } catch (error) {
    SaveDetail(id, resolve);
  }
};

export default SaveDetail;