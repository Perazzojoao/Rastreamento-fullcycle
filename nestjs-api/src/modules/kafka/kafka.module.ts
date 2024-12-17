import { Inject, Module, OnModuleInit } from '@nestjs/common';
import * as KafkaLib from '@confluentinc/kafka-javascript';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: (configService: ConfigService) => {
        const broker = configService.get('KAFKA_BROKER') || 'localhost:9092';
        return new KafkaLib.KafkaJS.Kafka({
          'bootstrap.servers': broker,
        }).producer();
      },
      inject: [ConfigService],
    },
  ],
  exports: ['KAFKA_PRODUCER'],
})
export class KafkaModule implements OnModuleInit {
  constructor(
    @Inject('KAFKA_PRODUCER')
    private kafkaProducer: KafkaLib.KafkaJS.Producer,
  ) {}

  async onModuleInit() {
    await this.kafkaProducer.connect();
  }
}
