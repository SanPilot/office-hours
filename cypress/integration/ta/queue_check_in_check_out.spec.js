import {
  createAndLoginTA,
  checkInTA,
  createQueue,
  createQuestion,
} from "../../utils";

describe("Can successfuly check in and out of a queue when their is scheduled office hours", () => {
  beforeEach(() => {
    // Set the state
    createAndLoginTA();
    createQueue({
      courseId: "ta.course.id",
    });
  });

  it("checking in multiple TAs then checking one out", function () {
    createAndLoginTA({
      identifier: "ta2",
      courseId: "ta.course.id",
    });
    checkInTA();
    createQuestion({
      queueId: "queue.id",
    });

    cy.get(".ant-modal-close-x").click();
    // Click "Check in"
    cy.get("[data-cy='check-in-button']").click();
    cy.location("pathname").should("contain", "/queue");

    // Wait to see that the user has been checked in
    cy.contains("Check Out");
    cy.get("[data-cy='ta-status-card']").should("have.length", "2");
    cy.percySnapshot("TA Queue Page - Two TA's Checked In");

    // 1 student should be in the queue
    cy.get("[data-cy='ta-queue-card']").should("have.length", "1");

    // Click "Check out"
    cy.get("[data-cy='check-out-button']").click();
    cy.get("button").should("contain", "Check In");

    // Other TA should still be checked in, and there should still be 1 student in the queue
    cy.get("[data-cy='ta-status-card']").should("have.length", "1");
    cy.get("[data-cy='ta-queue-card']").should("have.length", "1");
    cy.percySnapshot("TA Queue Page - One TA Checked out One TA Checked In");
  });

  it("from the queue page", function () {
    // Visit the queue page
    cy.visit(`/course/${this.queue.courseId}/queue/${this.queue.id}`);

    // Click "Check in"
    cy.get("body").should("contain", "There are no questions in the queue");
    cy.get("[data-cy='check-in-button']").click();

    // Wait to see that the user has been checked in
    cy.contains("Check Out");
    cy.percySnapshot("TA Queue Page - TA Checked In");

    // Click "Check out"
    cy.get("[data-cy='check-out-button']").click();
    cy.get("button").should("contain", "Check In");

    cy.percySnapshot("TA Queue Page - TA Checked Out");
  });

  it("checkout from the today page", function () {
    // Visit the today page
    cy.visit(`/course/${this.queue.courseId}/today`);

    // Wait for page to load
    cy.get(".ant-modal-close-x").click();
    cy.contains("No Staff Checked In");

    // Click "Check in"
    cy.get("[data-cy='check-in-button']").click();

    cy.location("pathname").should("contain", "/queue");
    cy.get("body").should("contain", "There are no questions in the queue");

    cy.percySnapshot("TA Today Page - TA Checked In");

    cy.visit(`/course/${this.ta.courseId}/today`);

    // Click "Check out"
    cy.get("[data-cy='check-out-button']").click();
    cy.get("button").should("contain", "Check In");

    cy.percySnapshot("TA Today Page - TA Checked Out");
  });

  describe("it opens the clean queue page", () => {
    beforeEach(() => {
      // Check in
      cy.get("@queue").then((queue) => {
        cy.request(
          "POST",
          `/api/v1/courses/${queue.courseId}/ta_location/${queue.room}`
        );
        // populate with question
        cy.request("POST", "/api/v1/seeds/createQuestion", {
          queueId: queue.id,
        });
      });
    });
    it.only("from the queue apge", () => {
      // TODO: change the office hour time
      // Visit the queue page
      cy.get("@queue").then((queue) => {
        cy.visit(`/course/${queue.courseId}/queue/${queue.id}`);
        // Click "Check out"
        cy.get("[data-cy='check-out-button']").click();
        cy.get("button").should("contain", "Check In");
      });
    });
  });
});

describe("Checking in and out when there arent scheduled office hours", () => {
  beforeEach(() => {
    createAndLoginTA();
  });

  it("checking in a TA when there is not scheduled office hours", function () {
    // check into the queue
    cy.request({
      method: "POST",
      url: `/api/v1/courses/${this.ta.courseId}/ta_location/Online`,
    })
      .then((res) => res.body)
      .as("queue")
      .then((queue) => {
        // add a question to the queue
        createQuestion({
          queueId: "queue.id",
        });
        // Navigate to the queue page
        cy.visit(`/course/${this.ta.courseId}/queue/${queue.id}`);
      });

    // The ta should show as checked in
    cy.get("[data-cy='ta-status-card']").should("be.visible");
    // 1 student should be in the queue
    cy.get("[data-cy='ta-queue-card']").should("have.length", "1");

    // Click "Check out"
    cy.get("[data-cy='check-out-button']").click();
    cy.get("button").should("contain", "Check In");

    // No TAs should be checked in, and there should not be any student in the queue
    cy.get("[data-cy='ta-status-card']").should("not.visible");
    cy.get("[data-cy='ta-queue-card']").should("not.visible");
  });
});
