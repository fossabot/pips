import { Mock, It, Times } from "typemoq";
import * as Bunyan from "bunyan";
import { IRouterContext } from "koa-router";
import { RequestLogger } from "../../src/middleware/request-logger";

describe("RequestLogger", () => {
    it("should call Bunyan.info() with requestId and req values", () => {
        // Arrange
        const logMock = Mock.ofType<Bunyan>();
        const routerContextMock = Mock.ofType<IRouterContext>();
        const requestLogger = new RequestLogger(logMock.object);

        logMock.setup((x) => x.info(It.isAny(), It.isAnyString()));

        // Act
        requestLogger.use(routerContextMock.object, () => Promise.resolve());

        // Assert
        logMock.verify((x) => x.info(
            It.is((obj) => obj.hasOwnProperty("requestId") && obj.hasOwnProperty("req")),
            It.is((str) => str === "Request received")
        ), Times.once());
    });

    it("should call next()", () => {
        // Arrange
        const logMock = Mock.ofType<Bunyan>();
        const routerContextMock = Mock.ofType<IRouterContext>();
        const nextMock = Mock.ofType<(err?: any) => Promise<any>>();
        const requestLogger = new RequestLogger(logMock.object);

        nextMock.setup((x) => x(It.isAny())).returns(() => Promise.resolve());

        // Act
        requestLogger.use(routerContextMock.object, nextMock.object);

        // Assert
        nextMock.verify((x) => x(It.isAny()), Times.once());
    });
});
