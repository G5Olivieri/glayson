# frozen_string_literal: true

module Api
  class TransactionsController < ApplicationController
    def index
      @transactions = Transaction.all.group_by { |transaction| transaction.datetime.to_date }
      render json: @transactions
    end

    def show
      @transaction = Transaction.find(params[:id])
      render json: @transaction
    end

    def create
      @transaction = Transaction.new(transaction_params)
      if @transaction.save
        redirect_to @transaction
      else
        render status: :unprocessable_entity
      end
    end
    def update
      @transaction = Transaction.find(params[:id])
      if @transaction.update(transaction_params)
        redirect_to @transaction
      else
        render status: :unprocessable_entity
      end
    end

    def destroy
      @transaction = Transaction.find(params[:id])
      @transaction.destroy
      render status: :no_content
    end

    private

    def transaction_params
      params.require(:transaction).permit(:name, :description, :amount, :datetime)
    end
  end
end
